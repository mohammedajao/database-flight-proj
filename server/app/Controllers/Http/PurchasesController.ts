import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Purchase from 'App/Models/Purchase'
import PurchaseSource from 'App/Models/PurchaseSource'
import ProductPurchase from 'App/Models/ProductPurchase'
import AgentPurchase from 'App/Models/AgentPurchase'
import Customer from 'App/Models/Customer'
import BookingAgent from 'App/Models/BookingAgent'
import Ticket from 'App/Models/Ticket'
import Flight from 'App/Models/Flight'
import Has from 'App/Models/Has'
import Use from 'App/Models/Use'
import Airplane from 'App/Models/Airplane'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class PurchasesController {

    public async getClients({ request, auth, response }: HttpContextContract) {
        const validSchema = schema.create({
            flight_id: schema.number(),
            agent_id: schema.number()
        })
        
        const data = await request.validate({ schema: validSchema })
        const agent = await BookingAgent.query().where({ agent_id: data.agent_id }).firstOrFail()
        const agentPurchases = AgentPurchase.query().where({ ba_agent_id: agent.agent_id }).select('purchase_id')
        const purchases = await Purchase.query().whereIn(['id'], agentPurchases)

        return response.json({ purchases })
    }

    public async create({ request, auth, response }: HttpContextContract) {
        const purchaseSchema = schema.create({
            flight_id: schema.number(),
            agent_id: schema.number.optional(),
            creditCardNum: schema.string(),
            creditCardExpDate: schema.date(),
            purchaseFor: schema.number.optional(),
            type: schema.enum.optional([1,2] as const)
        })

        try {
            const user = await auth.user 
            if(!user) {
                throw new AuthenticationException('Must be logged in!', '400', 'api')
            }
            const data = await request.validate({ schema: purchaseSchema })
            if(data.type == 2 && !data.agent_id) {
                return response.json({
                    error: 'Cannot hire an agent without sending an agent id!'
                })
            }
            const flight = await Flight.query().where({ id: data.flight_id }).firstOrFail()
            const use = Use.query().where({ flight_id: flight.id })
            const airplane = await Airplane.query().whereExists(use).firstOrFail()
            const hasCounter = await Has.query().where({ flight_id: flight.id }).count('*').firstOrFail()
            const hasCount = hasCounter["count(*)"]
            const price = ((hasCount < (0.7*airplane.seats)) ? flight.base_price : (flight.base_price + (0.2*flight.base_price)))


            if(hasCount >= airplane.seats) {
                return response.json({
                    error: 'This flight has reached max occupancy!'
                })
            }

            console.log("Max not hit")

            const purchase = await Purchase.create({
                price: price,
                flight_num: flight.id,
                credit_card_exp_date: data.creditCardExpDate,
                credit_card_num: data.creditCardNum
            })
            const purchaseSource = await PurchaseSource.create({
                purchaser_email: user.email,
                purchase_id: purchase.id,
                purchased_for: data.purchaseFor || purchase.id,
                flight_id: flight.id,
                type: data.type
            })

            let childPurchase;
            if(data.type == 2) {
                const agent = await BookingAgent.query().where({ agent_id: data.agent_id }).firstOrFail()
                childPurchase = await AgentPurchase.create({
                    purchase_id: purchase.id,
                    ba_agent_id: agent.agent_id,
                    commission: 0
                })
            } else {
                const ticket = await Ticket.create({
                    base_price: flight.base_price
                })
                const has = await Has.create({
                    ticket_id: ticket.id,
                    flight_id: flight.id
                })
                childPurchase = await ProductPurchase.create({
                    purchase_id: purchase.id,
                    ticket_id: ticket.id
                })

                if(user.type == 2) {
                    const agent = await BookingAgent.query().where({ user_email: user.email }).firstOrFail()
                    const agentPurchase = await AgentPurchase.query().where({ purchase_id: data.purchaseFor, ba_agent_id: agent.agent_id }).firstOrFail()
                    const clientPurchase = await Purchase.query().where({ id: data.purchaseFor }).firstOrFail()
                    agent.commission = agent.commission + (0.1*price)
                    agentPurchase.commission = 0.1*price
                    clientPurchase.status = 2

                    await agent.save()
                    await agentPurchase.save()
                    await clientPurchase.save()
                }
            }

            return response.json({ purchaseSource })
        } catch(err) {
            console.log(err)
            return response.status(400).send({
                error: err.messages
            })
        }
    }

    public async getTicketsSoldInRange({ request, response }: HttpContextContract) {
        const dataSchema = schema.create({
            endDate: schema.date(),
            startDate: schema.date(),
            airline: schema.string()
        })

        const validData = await request.validate({ schema: dataSchema })
        const ticketsSold  = await Database.rawQuery('Select COUNT(id) AS ticketsSold FROM Purchases WHERE id in (SELECT purchase_id FROM ProductPurchases)  AND flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)  AND created_at >= ? AND created_at <= ? ', [validData.airline, validData.startDate.toISODate(), validData.endDate.toISODate()])
        const report = await Database.rawQuery('Select YEAR(created_at) AS yearSold, MONTH(created_at) as monthSold, COUNT(id) AS ticketsSold FROM Purchases WHERE id in (SELECT purchase_id FROM ProductPurchases)  AND flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)  AND created_at >= ? AND created_at <= ? GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY YEAR(created_at), MONTH(created_at)', [validData.airline, validData.startDate.toISODate(), validData.endDate.toISODate()])
        return response.json({ tickets_sold_in_range: ticketsSold, report })
    }

    public async getMonthlyTicketReport({params, response }: HttpContextContract) {
        const airline = params.airline
        const report = await Database.rawQuery('SELECT YEAR(created_at) AS yearSold, MONTH(created_at) as monthSold, COUNT(id) AS TOTALCOUNT FROM Purchases WHERE flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?) GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY YEAR(created_at), MONTH(created_at)', airline)
        return response.json({ report })
    }

    public async revenueSources({ request, response }: HttpContextContract) {
        const dataSchema = schema.create({
            startDate: schema.date(),
            airline: schema.string()
        })

        const validData = await request.validate({ schema: dataSchema })
        const directRevenue = await Database.rawQuery('SELECT SUM(ps.price) AS revenue FROM Purchases AS ps WHERE ps.created_at > ? AND ps.id IN (SELECT pp.purchase_id FROM ProductPurchases AS pp) AND ps.id IN (SELECT pes.purchase_id FROM PurchaseSources AS pes WHERE pes.purchaser_email IN (SELECT c.user_email FROM Customers AS c)) AND ps.flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)', [validData.startDate.toISODate(), validData.airline])
        const indirectRevenue = await Database.rawQuery('SELECT SUM(ps.price) AS revenue FROM Purchases AS ps WHERE ps.created_at > ? AND ps.id IN (SELECT pp.purchase_id FROM ProductPurchases AS pp) AND ps.id IN (SELECT pes.purchase_id FROM PurchaseSources AS pes WHERE pes.purchaser_email IN (SELECT c.user_email FROM BookingAgents AS c)) AND ps.flight_num IN (SELECT f.id FROM Flights AS f WHERE f.owned_by = ?)', [validData.startDate.toISODate(), validData.airline])
        return response.json({ directRevenue, indirectRevenue })
    }

    public async getTopClients({ params, response }: HttpContextContract) {
        /*
        Top 5 customers based on number of tickets bought from the booking agent in
        the past 6 months and top 5 customers based on amount of commission received in the last year. Show
        a bar chart showing each of these 5 customers in x-axis and number of tickets bought in y-axis. Show
        another bar chart showing each of these 5 customers in x-axis and amount commission received in yaxis.
        */
       const agentid = params.agentid
       const topHalfYearCustomers = await Database.rawQuery('SELECT MONTH(p.created_at) AS MONTHBOUGHT, ps.purchaser_email, COUNT(p.id) AS AMOUNT FROM Purchases AS p, PurchaseSources AS ps WHERE MONTH(p.created_at) >= MONTH(NOW()) - 6 AND ps.purchase_id IN (SELECT ap.purchase_id FROM AgentPurchases AS ap WHERE ap.ba_agent_id = ?) GROUP BY MONTHBOUGHT, ps.purchaser_email ORDER BY AMOUNT DESC LIMIT 5', agentid)
       const topCommissionCustomers = await Database.rawQuery('SELECT MONTH(p.created_at) AS MONTHBOUGHT, ps.purchaser_email, SUM(ap.commission) AS AMOUNT FROM AgentPurchases AS ap, Purchases AS p, PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT app.purchase_id FROM AgentPurchases AS app WHERE app.ba_agent_id = ?) AND ps.purchase_id IN (SELECT p.id FROM Purchases AS p WHERE YEAR(p.created_at) >= YEAR(NOW())) GROUP BY MONTHBOUGHT, ps.purchaser_email ORDER BY AMOUNT DESC', agentid)
        
       return response.json({ monthly_report: topHalfYearCustomers, yearly_report: topCommissionCustomers })
    }

    public async getCommission({ request, response }: HttpContextContract) {
        const dataSchema = schema.create({
            agent_id: schema.number(),
            startDate: schema.date()
        })
        const validData = await request.validate({ schema: dataSchema })
        /*
        Default view will be total amount of commission received in the past 30 days
        and the average commission he/she received per ticket booked in the past 30 days and total
        number of tickets sold by him in the past 30 days. He/she will also have option to specify a range of
        dates to view total amount of commission received and total numbers of tickets sold.
        */
       const commission = await Database.rawQuery('SELECT SUM(ap.commission) AS TOTALCOMMISSION FROM AgentPurchases AS ap WHERE ap.ba_agent_id=? AND ap.purchase_id IN (SELECT p.id FROM Purchases AS p WHERE p.created_at >= ?)', [validData.agent_id, validData.startDate.toISODate()])
       const ticketsSold = await Database.rawQuery('SELECT COUNT(pp.id) AS TICKETSSOLD FROM ProductPurchases AS pp WHERE pp.purchase_id IN (SELECT mp.id FROM Purchases AS mp WHERE mp.created_at >= ?) AND pp.purchase_id IN (SELECT ps.purchase_id FROM PurchaseSources AS ps WHERE ps.purchaser_email IN (SELECT ba.user_email FROM BookingAgents AS ba WHERE ba.agent_id = ?))', [validData.startDate.toISODate(), validData.agent_id])
    
       return response.json({ total_commission: commission, total_tickets_sold: ticketsSold })
    }

    public async getSpending({ request, auth, response }: HttpContextContract) {
        const user = await auth.user
        if(!user || user.type != 1) {
            return response.json({
                error: "User must be a customer"
            })
        }
        const dataSchema = schema.create({
            email: schema.string(),
            startDate: schema.date(),
            endDate: schema.date()
        })

        const validData = await request.validate({ schema: dataSchema })
        const moneySpentYear = await Database.rawQuery('SELECT SUM(p.price) AS AMOUNT FROM Purchases AS p WHERE p.id IN (SELECT ps.purchase_id FROM PurchaseSources AS ps WHERE ps.purchaser_email = ?) AND p.created_at >= ? AND p.created_at <= ?', [validData.email, validData.startDate.toISODate(), validData.endDate.toISODate()])
        return response.json({ annual_payment: moneySpentYear })
    }

    public async getMonthlySpending({ request, response }: HttpContextContract) {
        const dataSchema = schema.create({
            email: schema.string()
        })
        const validData = await request.validate({ schema: dataSchema })

        const monthlySpent = await Database.rawQuery('SELECT MONTH(p.created_at) AS MONTHWORK, SUM(p.price) AS AMOUNT FROM Purchases AS p WHERE MONTH(p.created_at) > MONTH(NOW()) - 6 AND p.id IN (SELECT ps.purchase_id FROM PurchaseSources AS ps WHERE ps.purchaser_email = ?) GROUP BY MONTHWORK ORDER BY AMOUNT DESC', [validData.email])
        return response.json({ monthly_spending: monthlySpent })
    }
}

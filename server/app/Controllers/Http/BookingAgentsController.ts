import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import BookingAgent from 'App/Models/BookingAgent'
import Database from '@ioc:Adonis/Lucid/Database'

export default class BookingAgentsController {
    public async index({ request, response }: HttpContextContract) {
        const agents = await BookingAgent.all()

        return response.json({ agents })
    }

    public async create({ request, auth, response }: HttpContextContract) {
        const userSchema = schema.create({
            email: schema.string({ trim: true }, [
                rules.unique({ table: 'users', column: 'email'})
            ]),
            password: schema.string({}, [rules.minLength(8)]),
            type: schema.enum([1, 2, 3] as const),
            agent_id: schema.number([ rules.unique({ table: 'BookingAgents', column: 'agent_id' })])
        })

        const validData = await request.validate({ schema: userSchema})

        const user = await User.create({
            email: validData.email,
            password: validData.password,
            type: validData.type
        })
        const agent = await BookingAgent.create({
            user_email: user.email,
            agent_id: validData.agent_id
        })

        await auth.login(user)
        
        return response.json({ agent })
    }

    public async topAgents({ params, response }: HttpContextContract) {
        const airline = params.airline
        const yearTopAgents = await Database.rawQuery('SELECT agent_id, m.ticketsSold FROM BookingAgents AS ba, (SELECT COUNT(*) AS ticketsSold, purchaser_email FROM PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT id FROM Purchases AS pes WHERE YEAR(pes.created_at) > YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) AND ps.purchaser_email IN (SELECT user_email FROM BookingAgents) AND ps.flight_id IN (SELECT flight_id FROM Uses AS us WHERE us.airline_name = ?) GROUP BY purchaser_email) AS m WHERE m.purchaser_email = ba.user_email ORDER BY m.ticketsSold DESC', [airline])
        const monthTopAgents = await Database.rawQuery('SELECT agent_id, m.ticketsSold FROM BookingAgents AS ba, (SELECT COUNT(*) AS ticketsSold, purchaser_email FROM PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT id FROM Purchases AS pes WHERE MONTH(pes.created_at) > MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))) AND ps.purchaser_email IN (SELECT user_email FROM BookingAgents) AND ps.flight_id IN (SELECT flight_id FROM Uses AS us WHERE us.airline_name = ?) GROUP BY purchaser_email) AS m WHERE m.purchaser_email = ba.user_email ORDER BY m.ticketsSold DESC', airline)
        return response.json({ year: yearTopAgents, month: monthTopAgents })
    }

    public async getAgentCustFlights({ auth, response }: HttpContextContract) {
        const user = await auth.user
        if(!user || user.type != 2) {
            return response.json({
                error: "You must be an agent"
            })
        }
        const email = user.email
        const flights = await Database.rawQuery('SELECT * FROM Flights AS f, (SELECT purchaser_email FROM PurchaseSources AS ps WHERE ps.purchase_id IN (SELECT cd.purchased_for FROM PurchaseSources AS cd WHERE cd.purchaser_email = ?)) AS clients WHERE f.id IN (SELECT flight_num FROM Purchases AS p WHERE p.id IN (SELECT pes.purchase_id FROM PurchaseSources AS pes WHERE pes.purchaser_email = clients.purchaser_email AND pes.type = 2))', [email])

        return response.json({ flights })
    }
}

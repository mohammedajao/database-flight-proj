import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Flight from 'App/Models/Flight'
import Airline from 'App/Models/Airline'
import Airport from 'App/Models/Airport'
import Use from 'App/Models/Use'
import Airplane from 'App/Models/Airplane'
import Has from 'App/Models/Has'
import ProductPurchase from 'App/Models/ProductPurchase'
import AgentPurchase from 'App/Models/AgentPurchase'
import Purchase from 'App/Models/Purchase'
import Customer from 'App/Models/Customer'
import PurchaseSource from 'App/Models/PurchaseSource'
import Rate from 'App/Models/Rate'

export default class FlightsController {
    public async index({ response }: HttpContextContract) {
        const currentDate = new Date().toISOString()
        const flights = await Flight.query().where('depart_date_time', '>', currentDate)

        return response.json({ flights })
    }

    public async update({ request, auth, response }: HttpContextContract) {
        const flightSchema = schema.create({
            flight_id: schema.number(),
            status: schema.enum([1, 2, 3] as const)
        })

        const user = auth.user
        if(!user) {
            return response.status(400).send({
                error: 'You must be authenticated.'
            })
        }

        if(user.type != 3) {
            return response.status(400).send({
                error: 'You must be a staff member'
            })
        }

        const validData = await request.validate({ schema: flightSchema })
        const flight = await Flight.query().where({ id: validData.flight_id }).firstOrFail()

        flight.status = validData.status
        await flight.save()

        return response.json({ flight })
    }

    public async search({ request, response, params }: HttpContextContract) {
        const { depart_date_time, arrival_date_time, arrival_airport, departure_airport, arrival_city, departure_city } = request.all()
        let flightOutput = Flight.query().select('*')
        // const departFlights = Database.rawQuery("SELECT id, departure_airport FROM Flights AS f WHERE f.departure_airport IN (SELECT name FROM Airports AS ap WHERE ap.city = ?)", departure_city)
        // const arrivalFlights = Database.rawQuery("SELECT id, arrival_airport FROM Flights AS f WHERE f.arrival_airport IN (SELECT name FROM Airports AS ap WHERE ap.city = ?)", arrival_city)
        if(depart_date_time) 
            flightOutput = flightOutput.where('depart_date_time', '>', depart_date_time)
        if(arrival_date_time)
            flightOutput = flightOutput.where('arrival_date_time', '<', arrival_date_time )
        if(arrival_airport)
            flightOutput = flightOutput.where({ arrival_airport })
        if(departure_airport)
            flightOutput = flightOutput.where({ departure_airport })
        if(departure_city) {
            const departFlights = Database.rawQuery("SELECT id, departure_airport FROM Flights AS f WHERE f.departure_airport IN (SELECT name FROM Airports AS ap WHERE ap.city = ?)", departure_city)
            flightOutput = flightOutput.whereIn(['id', 'departure_airport'], departFlights)
        }
        if(arrival_city) {
            const arrivalFlights = Database.rawQuery("SELECT id, arrival_airport FROM Flights AS f WHERE f.arrival_airport IN (SELECT name FROM Airports AS ap WHERE ap.city = ?)", arrival_city)
            flightOutput = flightOutput.andWhereIn(['id', 'departure_airport'], arrivalFlights)
        }
        // const flights = await Flight.query().select('*').whereIn(['id', 'departure_airport'], departFlights).andWhereIn(['id', 'arrival_airport'], arrivalFlights).catch(err => {
        //     console.log(err)
        // })

        const flights = await flightOutput
        
        return response.json({ flights })
    }

    public async create({ request, auth, response }: HttpContextContract) {
        try {
            const user = auth.user
            if(!user) {
                return response.status(400).send({
                    error: 'You must be authenticated.'
                })
            }

            if(user.type != 3) {
                return response.status(400).send({
                    error: 'You must be a staff member'
                })
            }
            const flightSchema = schema.create({
                flight_num: schema.number(),
                airplane: schema.number(),
                depart_date_time: schema.date(),
                departure_airport: schema.string(),
                base_price: schema.number.optional(),
                arrival_date_time: schema.date.optional(),
                arrival_airport: schema.string.optional(),
                owned_by: schema.string(),
                type: schema.enum.optional([1,2] as const),
                status: schema.enum.optional([1, 2, 3] as const)
            })

            const messages = {
                '*': (field, rule, arrayExceptionPointer, options) => {
                    return `${field} failed ${rule} validation`
                }
            }
            const validData = await request.validate({ schema: flightSchema, messages })
            
            const airplane = await Airplane.query().where({ id: validData.airplane }).firstOrFail()

            const airline = await Airline.query().where({name: validData.owned_by}).firstOrFail()

            const departureAirport = await Airport.query().where({ name: validData.departure_airport }).firstOrFail()

            console.log("Found base instances")

            if(validData.arrival_airport) {
                const arrivalAirport = await Airport.query().where({ name: validData.arrival_airport }).first()
                if(!arrivalAirport) {
                    return response.status(400).send({
                        error: 'Invalid arrival airport name. Does not exist.'
                    })
                }
            }

            const flight = await Flight.create({
                owned_by: airline.name,
                flight_num: validData.flight_num,
                base_price: validData.base_price,
                depart_date_time: validData.depart_date_time,
                departure_airport: departureAirport.name,
                arrival_date_time: validData.arrival_date_time,
                arrival_airport: validData.arrival_airport,
                type: validData.type,
                status: validData.status
            })

            const useInstance = await Use.create({
                airline_name: airline.name,
                airplane_id: airplane.id,
                flight_id: flight.id
            })

            return response.json({ flight })
        } catch(err) {
            return response.status(400).send({
                error: err,
                message: 'An error occurred'
            })
        }
    }
 
    public async show({ request, auth, response, params }: HttpContextContract) {
        const id = params.id
        const user = await auth.user
        const flight = await Flight.query().where({ id }).preload('ratings').firstOrFail()
        const use = await Use.query().where({ flight_id: flight.id }).firstOrFail()
        const airplane = await Airplane.query().where({ id: use.airplane_id }).firstOrFail()
        const hasCount = await Has.query().where({ flight_id: flight.id }).count('*').firstOrFail()
        const totalRatings = await Rate.query().where({ flight_id: flight.id }).sum('rating as sum')
        let ratingsCount = await Rate.query().where({ flight_id: flight.id }).count('id as total')
        let avgRating = 0
        if(ratingsCount[0].total >= 1) {
            avgRating = totalRatings[0].sum / ratingsCount[0].total
        }

        let canComment = false
        // Detecting if current user has bought it

        if(user && user.type == 1) {
            console.log('Checking if purchased')
            const purchaseSource = await PurchaseSource.query().where({ flight_id: id }).first()
            // const hasQuery = Has.query().where({ flight_id: id })
            // const productPurchaseQuery = await ProductPurchase.query().whereIn(['ticket_id'], hasQuery)
            // const purchaseQuery = Purchase.query().whereIn(['id'], productPurchaseQuery)
            // const purchaseSource = await PurchaseSource.query().where({ flight_id: id }).andWhereIn(['id'], purchaseQuery).first()
            // console.log(purchaseSource)
            if(purchaseSource) {
                canComment = true
            }

        }
        return response.json({ data: flight, bookings: hasCount, maxOccupancy: airplane.seats, bought: canComment, avg_rating: avgRating })
    }

    public async getFlightByCustomerAirline({ request, auth, response }: HttpContextContract) {
        const dataSchema = schema.create({
            email: schema.string(),
            airline: schema.string()
        })

        const validData = await request.validate({ schema: dataSchema })        
        const flights = await Database.rawQuery('select * FROM `Flights` as f, (select `flight_id` from `PurchaseSources` where `purchaser_email` = ? and `flight_id` in (select `flight_id` from `Uses` where `airline_name` = ?)) as fis WHERE f.id = fis.flight_id', [validData.email, validData.airline])
        //const flights = await Flight.query().whereIn('id',purchaseQuery)     

        return response.json({ flights })
    }

    public async getCustomers({ request, response }: HttpContextContract) {
        const dataSchema = schema.create({
            airline: schema.string(),
            flight_id: schema.number()
        })
        const data = await request.validate({ schema: dataSchema })
        const flight = await Flight.query().where({ id: data.flight_id, owned_by: data.airline }).firstOrFail()
        const purchaseSources = PurchaseSource.query().where({ flight_id: flight.id }).select('purchaser_email')
        const customers = await Customer.query().whereIn(['user_email'], purchaseSources)

        return response.json({ customers })
    }
}

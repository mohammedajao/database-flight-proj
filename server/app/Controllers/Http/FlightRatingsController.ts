import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Customer from 'App/Models/Customer'
import Use from 'App/Models/Use'
import Flight from 'App/Models/Flight'
import Rate from 'App/Models/Rate'

export default class FlightRatingsController {
    public async index({ request, response }: HttpContextContract) {
        const airline_name = request.input('airline_name')
        // const uses = await Use.query().where({ airline_name: airline_name }).preload('flight_by_id')

        const ratings = Database.rawQuery('SELET * FROM FlightRatings as fr WHERE fr.flight_id IN (Select * FROM Uses WHERE  Uses.airline_name = ?)', airline_name)
        return response.json({ ratings })
    }

    public async flightIndex({ request, response }: HttpContextContract) {
        const indexSchema = schema.create({
            flight_id: schema.number()
        })
        const data = await request.validate({ schema: indexSchema })
        console.log(data.flight_id)

        const flight = await Flight.query().where({ id: data.flight_id }).firstOrFail()

        const ratings = await Rate.query().where({ flight_id: flight.id })
        return response.json({ ratings })
    }

    public async create({ request, response }: HttpContextContract) {
        const flight_id = request.input('flight_id')
        const email = request.input('email')
        const rate = request.input('rating')
        const comment = request.input('comment')

        const rating = await Rate.create({
            customer_email: email,
            flight_id,
            rating: rate,
            comment
        })

        return response.json({ rating })
    }
}

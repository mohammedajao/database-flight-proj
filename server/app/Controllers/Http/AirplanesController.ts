import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Airplane from 'App/Models/Airplane'
import Airline from 'App/Models/Airline'

export default class AirplanesController {
    public async index({ response }: HttpContextContract) {
        const airplanes = await Airplane.all()

        return response.json({ airplanes })
    }

    public async create({ request, response }: HttpContextContract) {
        const airline_name = request.input('airline_name')
        const seats = request.input('seats')

        const airline = await Airline.query().where({ name: airline_name }).firstOrFail()

        const airplane = await Airplane.create({
            owned_by: airline.name, 
            seats
        })

        return response.json({ airplane })
    }

    public async show({ response, params }: HttpContextContract) {
        const airplane = await Airplane.query().where({ id: params.id }).firstOrFail()

        return response.json({ airplane })
    }
}

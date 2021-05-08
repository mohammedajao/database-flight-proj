import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Airline from 'App/Models/Airline'

export default class AirlinesController {
    public async index({ response }: HttpContextContract) {
        const airlines = await Airline.all()

        return response.json({ airlines })
    }

    public async create({ request, response }: HttpContextContract) {
        const name = request.input('name')
        const fixedName = name.replace(' ', '%20')
        const airline = await Airline.create({ name: fixedName })

        return response.json({ airline })
    }

    public async show({ response, params }: HttpContextContract) {
        const airline = await Airline.query().where({ name: params.name }).firstOrFail()

        return response.json({ airline })
    }

    public async delete({ request, response }: HttpContextContract) {
        const name = request.input('name')
        const airline = await Airline.query().where({ name }).firstOrFail()
        const deleted = await airline.delete()

        response.json({ deleted })
    }
}

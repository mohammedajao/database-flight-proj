import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Airport from 'App/Models/Airport'

export default class AirportsController {

    public async index({ response }: HttpContextContract) {
        const airports = await Airport.all()

        return response.json({ airports })
    }

    public async create({ request, response }: HttpContextContract) {
        const { name, city } = request.all()
        const airport = await Airport.create({ name, city })

        return response.json({ airport })
    }

    public async show({ response, params }: HttpContextContract) {
        const airport = await Airport.query().where({ name: params.name }).firstOrFail()

        return response.json({ airport })
    }

    public async getTopAirports({ params, response }: HttpContextContract) {
        const airline = params.airline
        const airports = await Database.rawQuery('SELECT city, r.freq FROM Airports AS ap, (SELECT arrival_airport, owned_by, COUNT(*) AS freq FROM Flights INNER JOIN Has ON Flights.id = Has.flight_id GROUP BY arrival_airport, owned_by) AS r WHERE r.owned_by = ? AND ap.name = r.arrival_airport ORDER BY r.freq DESC LIMIT 3', [airline])
        
        return response.send({ airports })
    }
}

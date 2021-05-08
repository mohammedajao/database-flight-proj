import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Staff from 'App/Models/Staff'
import WorksFor from 'App/Models/WorksFor'
import Airline from 'App/Models/Airline'
import Airplane from 'App/Models/Airplane'
import Customer from 'App/Models/Customer'
import Use from 'App/Models/Use'
import PurchaseSource from 'App/Models/PurchaseSource'

export default class StaffController {
    public async getAirlineFromStaff({ auth, response }: HttpContextContract) {
        const user = await auth.user
        if(!user) {
            throw new AuthenticationException('User is not logged in.', '400')
        }
        const staff = await Staff.query().where({ user_email: user.email }).firstOrFail()
        const worksFor = await WorksFor.query().where({ staff_email: staff.user_email }).firstOrFail()
        const airline = await Airline.query().where({ name: worksFor.airline_name }).firstOrFail()

        return response.json({ airline })
    }

    public async getAirplanesFromStaffAirline({ auth, response, params }: HttpContextContract) {
        const user = await auth.user
        if(!user) {
            throw new AuthenticationException('User is not logged in.', '400')
        }
        const staff = await Staff.query().where({ user_email: user.email }).firstOrFail()
        const worksFor = await WorksFor.query().where({ staff_email: staff.user_email }).firstOrFail()
        const airline = await Airline.query().where({ name: worksFor.airline_name }).firstOrFail()
        const airplanes = await Airplane.query().where({ owned_by: airline.name })

        return response.json({ airplanes })
    }

    public async getAirlineTopCustomers({ params, auth, response }: HttpContextContract) {
        const user = await auth.user
        if(user && user.type != 3) {
            return response.status(400).send({
                error: "Must be a staff member to query"
            })
        }
        const airline = params.airline
        const usedQuery = Use.query().where({ airline_name: airline })
        const topPurchasers = await Database.rawQuery('SELECT COUNT(purchaser_email) AS freq, purchaser_email FROM PurchaseSources as d WHERE d.flight_id IN (SELECT flight_id FROM Uses AS us WHERE us.airline_name = ?) AND d.purchaser_email IN (SELECT user_email FROM Customers as c WHERE c.user_email = d.purchaser_email) AND d.purchase_id IN (SELECT id FROM Purchases as pes WHERE pes.id = d.purchase_id AND YEAR(pes.created_at) > YEAR(DATE_SUB(CURDATE(), INTERVAL 1 YEAR))) GROUP BY purchaser_email ORDER BY freq DESC', airline)

        return response.json({ topPurchasers })
    }
}

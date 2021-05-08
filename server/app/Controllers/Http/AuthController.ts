import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import BookingAgent from 'App/Models/BookingAgent'
import Staff from 'App/Models/Staff'
import Customer from 'App/Models/Customer'
import WorksFor from 'App/Models/WorksFor'
import Airline from 'App/Models/Airline'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class AuthController {
    public async login({ request, auth, response }: HttpContextContract) {
        const { email, password } = request.all()
        try {
            const token = await auth.attempt(email, password)
            const user = await User.query().where({ email: email }).firstOrFail()
            switch(user.type) {
                case 1:
                    const customer = await Customer.query().where({ user_email: email }).firstOrFail()
                    return response.json({ token, user: { type: user.type, data: customer } })
                case 2:
                    const agent = await BookingAgent.query().where({ user_email: email }).firstOrFail()
                    return response.json({ token, user: { type: user.type, data: agent } })
                case 3:
                    const staff = await Staff.query().where({ user_email: email }).firstOrFail()
                    const worksFor = await WorksFor.query().where({ staff_email: staff.user_email }).firstOrFail()
                    return response.json({ token, user: { type: user.type, data: { staff, airline: worksFor.airline_name }} })
            }

            throw new AuthenticationException('Could not get a user from login', '400')
        } catch(err) {
            return response.status(400).send({
                message: 'Could not verify credentials',
                error: err
            })
        }

    }

    public async register({ request, auth, response }: HttpContextContract) {
        try {
            const userSchema = schema.create({
                email: schema.string({ trim: true }, [
                    rules.unique({ table: 'users', column: 'email'})
                ]),
                password: schema.string({}, [rules.minLength(8)]),
                type: schema.enum([1, 2, 3] as const),
            })

            const agentSchema = schema.create({
                agent_id: schema.number([rules.unique({table: 'BookingAgents', column: 'agent_id'})])
            })

            const customerSchema = schema.create({
                building_num: schema.number.optional(),
                street: schema.string.optional(),
                city: schema.string.optional(),
                passport_exp_date: schema.date.optional(),
                passport_num: schema.number.optional(),
                dob: schema.date.optional()
            })

            const staffSchema = schema.create({
                username: schema.string({ trim: true }, [rules.unique({ table: 'Staff', column: 'username' })]),
                airline: schema.string({ trim: true })
            })
            
            const validData = await request.validate({ schema: userSchema})

            const user = new User()
            user.email = validData.email
            user.password = validData.password
            user.type = validData.type
            
            switch(user.type) {
                case 1:
                    const validCustomerData = await request.validate({ schema: customerSchema })
                    await user.save()

                    const token = await auth.use('api').generate(user)

                    const customer = await Customer.create({
                        user_email: user.email,
                        building_num: validCustomerData.building_num,
                        street: validCustomerData.street,
                        city: validCustomerData.city,
                        passport_exp_date: validCustomerData.passport_exp_date,
                        passport_num: validCustomerData.passport_num,
                        dob: validCustomerData.dob
                    })
                    auth.login(user)
                    return response.json({ user: { type: user.type, data: customer }, token: token })
                case 2:
                    const validAgentData = await request.validate({ schema: agentSchema })
                    await user.save()
                    const authToken = await auth.use('api').generate(user)
                    const agent = await BookingAgent.create({
                        user_email: user.email,
                        agent_id: validAgentData.agent_id
                    })
                    auth.login(user)
                    return response.json({ user: { type: user.type, data: agent }, token: authToken })
                case 3:
                    const validStaffData = await request.validate({ schema: staffSchema })
                    const airlineName = validStaffData.airline.replace(' ', '%20')
                    const airline = await Airline.query().where({ name: airlineName }).firstOrFail()
                    await user.save()
                    const userToken = await auth.use('api').generate(user)
                    const staff = await Staff.create({
                        user_email: user.email,
                        username: validStaffData.username
                    })
                    const worksFor = new WorksFor()
                    worksFor.staff_email = user.email
                    worksFor.airline_name = airline.name

                    await worksFor.save()
                    auth.login(user)

                    return response.json({ user: { type: user.type, data: { staff, airline: airlineName } }, token: userToken })
            }
        } catch(err) {
            return response.status(400).send({
                message: err
            })
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.logout()
        return response.json({
            message: 'Logout successful. Token deleted.'
        })
    }
}

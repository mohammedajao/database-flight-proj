import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Customer from 'App/Models/Customer'

export default class CustomersController {
    public async index({ request, response }: HttpContextContract) {
        const customers = await Customer.all()

        return response.json({ customers })
    }

    public async create({ request, auth, response }: HttpContextContract) {
        const userSchema = schema.create({
            email: schema.string({ trim: true }, [
                rules.unique({ table: 'users', column: 'email'})
            ]),
            password: schema.string({}, [rules.minLength(8)]),
            type: schema.enum([1, 2, 3] as const),
            building_num: schema.number.optional(),
            street: schema.string.optional(),
            city: schema.string.optional(),
            passport_exp_date: schema.date.optional(),
            passport_num: schema.number.optional(),
            dob: schema.date.optional()
        })

        const validData = await request.validate({ schema: userSchema})

        const user = await User.create(validData)
        const customer = await Customer.create({
            user_email: user.email,
            building_num: validData.building_num,
            street: validData.street,
            city: validData.city,
            passport_exp_date: validData.passport_exp_date,
            passport_num: validData.passport_num,
            dob: validData.dob
        })

        await auth.login(user)

        return response.json({ customer })
    }

    public async show({ response, params }: HttpContextContract) {
        const user = await User.query().where({ email: params.email }).firstOrFail()
        const customer = await Customer.query().where({ user_email: user.email }).firstOrFail()
        return response.json({ customer })
    }
}


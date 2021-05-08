import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Rate from 'App/Models/Rate'

export default class Customer extends BaseModel {
  public static table = 'Customers'

  @column({ isPrimary: true })
  public user_email: string

  @column()
  public building_num?: number

  @column()
  public street?: string

  @column()
  public city?: string

  @column()
  public passport_num?: number

  @column.date()
  passport_exp_date?: DateTime

  @column.date()
  public dob?: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_email',
    localKey: 'email'
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Rate, {
    foreignKey: 'customer_email',
    localKey: 'user_email'
  })
  public ratings: HasMany<typeof Rate>
}

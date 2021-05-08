import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Flight from 'App/Models/Flight'
import Customer from 'App/Models/Customer'

export default class Rate extends BaseModel {
  public static table = 'FlightRatings'

  @column({ isPrimary: true })
  public id: number

  @column()
  public rating: number

  @column()
  public flight_id: number

  @column()
  public comment: string

  @column()
  public customer_email: string

  @belongsTo(() => Customer, {
    foreignKey: 'customer_email',
    localKey: 'user_email'
  })
  public customer: BelongsTo<typeof Customer>

  @belongsTo(() => Flight, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public flight: BelongsTo<typeof Flight>
}

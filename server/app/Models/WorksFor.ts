import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Staff from 'App/Models/Staff'
import Airline from 'App/Models/Airline'

export default class WorksFor extends BaseModel {
  public static table = 'WorksFor'

  @column({ isPrimary: true })
  public id: number

  @column()
  public staff_email: string

  @column()
  public airline_name: string 

  @belongsTo(() => Airline, {
    foreignKey: 'airline_name',
    localKey: 'name'
  })
  public airlinne: BelongsTo<typeof Airline>

  @belongsTo(() => Staff, {
    foreignKey: 'staff_email',
    localKey: 'user_email'
  })
  public email: BelongsTo<typeof Staff>
}

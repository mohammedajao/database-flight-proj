import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import PurchaseStatus from 'Contracts/Enums/PurchaseStatus'
import Flight from 'App/Models/Flight'

export default class Purchase extends BaseModel {
  public static tableName = 'Purchases'

  @column({ isPrimary: true })
  public id: number

  @column()
  public price: number

  @column()
  public flight_num: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column()
  public credit_card_num: string

  @column.dateTime()
  public credit_card_exp_date: DateTime

  @column()
  public status: number

  @belongsTo(() => Flight, {
    localKey: 'id',
    foreignKey: 'flight_num'
  })
  public flight: BelongsTo<typeof Flight>
}

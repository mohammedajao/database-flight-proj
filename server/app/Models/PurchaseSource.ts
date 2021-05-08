import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Purchase from 'App/Models/Purchase'
import User from 'App/Models/User'
import PurchaseTypes from 'Contracts/Enums/PurchaseTypes'
import Flight from 'App/Models/Flight'

export default class PurchaseSource extends BaseModel {
  public static table = 'PurchaseSources'

  @column({ isPrimary: true })
  public id: number

  @column()
  public purchaser_email: string

  @column()
  public type: number

  @column()
  public purchase_id: number 

  @column()
  public purchased_for: number

  @column()
  public flight_id: number

  @belongsTo(() => User, {
    foreignKey: 'purchaser_email',
    localKey: 'email'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Purchase, {
    foreignKey: 'purchase_id',
    localKey: 'id'
  })
  public purchase_item: BelongsTo<typeof Purchase>

  @belongsTo(() => Purchase, {
    foreignKey: 'purchased_for',
    localKey: 'id'
  })
  public buyingFor: BelongsTo<typeof Purchase>

  @belongsTo(() => Flight, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public flight: BelongsTo<typeof Flight>

}

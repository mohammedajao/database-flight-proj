import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Ticket from 'App/Models/Ticket'
import Purchase from 'App/Models/Purchase'


export default class ProductPurchase extends BaseModel {
  public static table = 'ProductPurchases'

  @column({ isPrimary: true })
  public id: number

  @column()
  public ticket_id: number

  @column()
  public purchase_id: number

  @belongsTo(() => Ticket, {
    foreignKey: 'ticket_id',
    localKey: 'id'
  })
  public ticket: BelongsTo<typeof Ticket>

  @belongsTo(() => Purchase, {
    foreignKey: 'purchase_id',
    localKey: 'id'
  })
  public purchase: BelongsTo<typeof Purchase>
}

import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Has from 'App/Models/Has'
import ProductPurchase from 'App/models/ProductPurchase'

export default class Ticket extends BaseModel {
  public static tableName = 'Tickets'

  @column({ isPrimary: true })
  public id: number

  @column()
  public base_price: number

  @hasOne(() => Has, {
    foreignKey: 'ticket_id',
    localKey: 'id'
  })
  public has_flight: HasOne<typeof Has>

  @hasOne(() => ProductPurchase, {
    foreignKey: 'ticket_id',
    localKey: 'id'
  })
  public purchase: HasOne<typeof ProductPurchase>
}

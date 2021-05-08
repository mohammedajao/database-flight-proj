import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import BookingAgent from 'App/Models/BookingAgent'
import Purchase from 'App/Models/Purchase'

export default class Hire extends BaseModel {
  public static table = 'AgentPurchases'

  @column({ isPrimary: true })
  public id: number

  @column()
  public commission: number

  @column()
  public purchase_id: number

  @column()
  public ba_agent_id: number

  @belongsTo(() => Purchase, {
    foreignKey: 'purchase_id',
    localKey: 'id'
  })
  public purchase: BelongsTo<typeof Purchase>

  @belongsTo(() => BookingAgent, {
    foreignKey: 'agent_id',
    localKey: 'ba_agent_id'
  })
  public agents: BelongsTo<typeof BookingAgent>
}

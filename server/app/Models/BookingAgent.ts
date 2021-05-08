import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class BookingAgent extends BaseModel {
  public static table = 'BookingAgents'

  @column({ isPrimary: true })
  public user_email: string

  @column()
  public agent_id: number

  @column()
  public commission: number

  @belongsTo(() => User, {
    foreignKey: 'user_email',
    localKey: 'email'
  })
  public user: BelongsTo<typeof User>
}

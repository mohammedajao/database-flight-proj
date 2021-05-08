import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Airline from 'App/Models/Airline'
import Use from 'App/Models/Use'

export default class Airplane extends BaseModel {
  public static table = 'Airplanes'
  @column({ isPrimary: true })
  public id: number

  @column()
  public owned_by: string

  @column()
  public seats: number

  @belongsTo(() => Airline, {
    foreignKey: 'owned_by',
    localKey: 'name'
  })
  public airline: BelongsTo<typeof Airline>

  @hasMany(() => Use, {
    foreignKey: 'airplane_id',
    localKey: 'id'
  })
  public use_by_id: HasMany<typeof Use>
}

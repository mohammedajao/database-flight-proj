import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Flight from 'App/Models/Flight'
import Ticket from 'App/Models/Ticket'

export default class Has extends BaseModel {
  public static table = 'Has'

  @column({ isPrimary: true })
  public id: number

  @column()
  public ticket_id: number

  @column()
  public flight_id: number 

  @belongsTo(() => Flight, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public flight: BelongsTo<typeof Flight>

  @belongsTo(() => Ticket, {
    foreignKey: 'ticket_id',
    localKey: 'id'
  })
  public ticket: BelongsTo<typeof Ticket>
}

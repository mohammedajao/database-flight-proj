import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Airplane from 'App/Models/Airplane'
import Flight from 'App/Models/Flight'
``
export default class Use extends BaseModel {
  public static tableName = 'Uses'

  @column({ isPrimary: true })
  public id: number

  @column()
  public airplane_id: number

  @column({ isPrimary: true })
  public flight_id: number 

  @column.dateTime()
  public flight_depart_date_time: DateTime

  @column()
  public airline_name: string 

  @belongsTo(() => Airplane, {
    foreignKey: 'airline_name',
    localKey: 'name'
  })
  public airplane_by_airline: BelongsTo<typeof Airplane>

  @belongsTo(() => Airplane, {
    foreignKey: 'airplane_id',
    localKey: 'id'
  })
  public airplane_by_id: BelongsTo<typeof Airplane>

  @belongsTo(() => Flight, {
    foreignKey: 'flight_num',
    localKey: 'id'
  })
  public flight_by_id: BelongsTo<typeof Flight>
}

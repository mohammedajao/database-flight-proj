import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Airport from 'App/Models/Airport'
import FlightStatus from 'Contracts/Enums/FlightStatus'
import FlightTypes from 'Contracts/Enums/FlightTypes'
import Airline from 'App/Models/Airline'
import Use from 'App/Models/Use'
import Rate from 'App/Models/Rate'
import Has from 'App/Models/Has'
import Purchase from 'App/Models/Purchase'
import PurchaseSource from 'App/Models/PurchaseSource'

export default class Flight extends BaseModel {
  public static tableName = 'Flights'

  @column({ isPrimary: true })
  public id: number

  @column()
  public flight_num: number

  @column()
  public base_price: number

  @column.dateTime()
  public depart_date_time: DateTime

  @column.dateTime()
  public arrival_date_time: DateTime

  @column()
  public arrival_airport: string

  @column()
  public departure_airport: string

  @column()
  public owned_by: string

  @column()
  public status: number

  @column()
  public type: number

  @belongsTo(() => Airline, {
    foreignKey: 'owned_by',
    localKey: 'name'
  })
  public airline: BelongsTo<typeof Airline>

  @belongsTo(() => Airport, {
    foreignKey: 'arrival_airport',
    localKey: 'name'
  })
  public arrival_airport_name: BelongsTo<typeof Airport>


  @belongsTo(() => Airport, {
    foreignKey: 'departure_airport',
    localKey: 'name'
  })
  public departure_airport_name: BelongsTo<typeof Airport>

  @hasMany(() => Use, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public uses_by_id: HasMany<typeof Use>

  @hasMany(() => Has, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public has_ticket: HasMany<typeof Has>

  @hasMany(() => Rate, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public ratings: HasMany<typeof Rate>

  @hasMany(() => Purchase, {
    foreignKey: 'flight_num',
    localKey: 'id'
  })
  public purchases: HasMany<typeof Purchase>

  @hasMany(() => PurchaseSource, {
    foreignKey: 'flight_id',
    localKey: 'id'
  })
  public purchaseSources: HasMany<typeof PurchaseSource>
}

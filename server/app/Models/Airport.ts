import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Flight from 'App/Models/Flight'

export default class Airport extends BaseModel {
  public static table = 'Airports'

  @column({ isPrimary: true })
  public name: string

  @column()
  public city: string

  @hasMany(() => Flight, {
    foreignKey: 'arrival_airport',
    localKey: 'name'
  })
  public arrival_flights: HasMany<typeof Flight>

  @hasMany(() => Flight, {
    foreignKey: 'departure_airport',
    localKey: 'name'
  })
  public departure_flights: HasMany<typeof Flight>
}

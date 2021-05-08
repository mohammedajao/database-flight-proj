import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import WorksFor from 'App/Models/WorksFor'
import Airplane from 'App/Models/Airplane'
import Flight from 'App/Models/Flight'

export default class Airline extends BaseModel {
  public static table = 'Airlines'

  @column({ isPrimary: true })
  public name: string

  @hasMany(() => WorksFor, {
    foreignKey: 'airline_name',
    localKey: 'name'
  })
  public staff_works_for: HasMany<typeof WorksFor>

  @hasMany(() => Airplane, {
    foreignKey: 'owned_by',
    localKey: 'name'
  })
  public airplanes: HasMany<typeof Airplane>

  @hasMany(() => Flight, {
    foreignKey: 'owned_by',
    localKey: 'name'
  })
  public flights: HasMany<typeof Flight>
}

import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Staff extends BaseModel {
  public static tableName = 'Staff'

  @column({ isPrimary: true })
  public user_email: string


  @column()
  public username: string

  @belongsTo(() => User, {
    foreignKey: 'user_email',
    localKey: 'email'
  })
  public user: BelongsTo<typeof User>
}

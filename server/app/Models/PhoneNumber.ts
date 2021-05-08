import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'


export default class PhoneNumber extends BaseModel {
  public static tableName = 'PhoneNumbers'

  @column({ isPrimary: true })
  public user_email: string

  @column()
  public phone_number: string

  @belongsTo(() => User, {
    foreignKey: 'user_email',
    localKey: 'email'
  })
  public user: BelongsTo<typeof User>
}

import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, hasMany, HasMany, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import UserTypes from 'Contracts/Enums/UserTypes'
import PhoneNumber from 'App/Models/PhoneNumber'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
  public static tableName = 'Users'

  @column({ isPrimary: true })
  public id: number
  
  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public remember_me_token?: string

  @column()
  public type: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => PhoneNumber, {
    foreignKey: 'user_email',
    localKey: 'email'
  })
  public phone_numbers: HasMany<typeof PhoneNumber>

}

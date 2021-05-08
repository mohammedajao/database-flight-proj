import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Staff extends BaseSchema {
  protected tableName = 'Staff'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_email').references('email').inTable('Users').primary().onDelete('CASCADE').onUpdate('CASCADE')
      table.string('username').notNullable().unique()

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

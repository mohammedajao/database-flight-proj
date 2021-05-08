import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PhoneNumber extends BaseSchema {
  protected tableName = 'PhoneNumbers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_email', 255).references('email').inTable('Users').primary().onDelete('CASCADE').onUpdate('CASCADE')
      table.string('phone_number', 10).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

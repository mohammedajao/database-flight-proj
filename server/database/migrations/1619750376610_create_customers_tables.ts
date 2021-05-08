import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customer extends BaseSchema {
  protected tableName = 'Customers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_email').references('email').inTable('Users').notNullable().primary().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('building_num')
      table.string('street')
      table.string('city')
      table.date('passport_exp_date')
      table.integer('passport_num')
      table.date('dob')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

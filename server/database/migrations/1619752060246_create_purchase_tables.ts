import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Purchases extends BaseSchema {
  protected tableName = 'Purchases'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('price')
      table.integer('flight_num').unsigned().references('id').inTable('Flights').notNullable()
      table.string('credit_card_num', 16).notNullable()
      table.date('credit_card_exp_date').notNullable()
      table.integer('status').unsigned().notNullable().defaultTo(1)
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

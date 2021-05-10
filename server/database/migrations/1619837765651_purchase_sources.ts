import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PurchaseSources extends BaseSchema {
  protected tableName = 'PurchaseSources'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('purchaser_email').references('email').inTable('Users').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('type').unsigned().notNullable().defaultTo(1)
      table.integer('flight_id').unsigned().references('id').inTable('Flights').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      table.integer('purchase_id').unsigned().references('id').inTable('Purchases').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('purchased_for').unsigned().references('id').inTable('Purchases').nullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

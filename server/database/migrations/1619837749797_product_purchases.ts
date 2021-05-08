import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductPurchases extends BaseSchema {
  protected tableName = 'ProductPurchases'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('purchase_id').unsigned().references('id').inTable('Purchases').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('ticket_id').unsigned().references('id').inTable('Tickets').notNullable().onDelete('CASCADE').onUpdate('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

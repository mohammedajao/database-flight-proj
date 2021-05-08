import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ticket extends BaseSchema {
  protected tableName = 'Tickets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('base_price')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

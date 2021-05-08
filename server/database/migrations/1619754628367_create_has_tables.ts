import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Has extends BaseSchema {
  protected tableName = 'Has'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('flight_id').unsigned().references('id').inTable('Flights').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('ticket_id').unsigned().references('id').inTable('Tickets').notNullable().onDelete('CASCADE').onUpdate('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Flight extends BaseSchema {
  protected tableName = 'Flights'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('flight_num').notNullable()
      table.dateTime('depart_date_time').notNullable()
      table.dateTime('arrival_date_time')
      table.integer('base_price').unsigned()
      table.string('arrival_airport').references('name').inTable('Airports').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('departure_airport').references('name').inTable('Airports').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.string('owned_by').references('name').inTable('Airlines').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('status').unsigned().notNullable().defaultTo(1)
      table.integer('type').unsigned().notNullable().defaultTo(1)

      table.unique(['flight_num', 'depart_date_time'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

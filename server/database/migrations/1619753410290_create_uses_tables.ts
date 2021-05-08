import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Uses extends BaseSchema {
  protected tableName = 'Uses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('airplane_id').unsigned().references('id').inTable('Airplanes').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.string('airline_name').references('owned_by').inTable('Airplanes').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('flight_id').unsigned().references('id').inTable('Flights').notNullable().onDelete('CASCADE').onUpdate('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

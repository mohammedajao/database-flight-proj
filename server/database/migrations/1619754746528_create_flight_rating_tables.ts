import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FlightRating extends BaseSchema {
  protected tableName = 'FlightRatings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('flight_id').unsigned().references('id').inTable('Flights').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.string('customer_email').references('user_email').inTable('Customers').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('rating')
      table.string('comment')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

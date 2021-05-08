import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Airplane extends BaseSchema {
  protected tableName = 'Airplanes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('owned_by').references('name').inTable('Airlines').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('seats')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WorksFor extends BaseSchema {
  protected tableName = 'WorksFor'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('airline_name').references('name').inTable('Airlines').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.string('staff_email').references('user_email').inTable('Staff').notNullable().onDelete('CASCADE').onUpdate('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

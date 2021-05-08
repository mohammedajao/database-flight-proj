import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Airport extends BaseSchema {
  protected tableName = 'Airports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name').primary()
      table.string('city').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

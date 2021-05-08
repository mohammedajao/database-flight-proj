import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Airline extends BaseSchema {
  protected tableName = 'Airlines'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name').primary()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

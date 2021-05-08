import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BookingAgent extends BaseSchema {
  protected tableName = 'BookingAgents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_email', 255).references('email').inTable('Users').primary().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('agent_id').unique()
      table.integer('commission').defaultTo(0)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

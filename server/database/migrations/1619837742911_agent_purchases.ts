import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AgentPurchases extends BaseSchema {
  protected tableName = 'AgentPurchases'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('commission')
      table.integer('purchase_id').unsigned().references('id').inTable('Purchases').notNullable().onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('ba_agent_id').references('agent_id').inTable('BookingAgents').notNullable().onDelete('CASCADE').onUpdate('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

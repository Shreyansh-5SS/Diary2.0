/**
 * Migration: Add monthly_carryover table for tracking balance rollover
 */
export const up = async (knex) => {
  await knex.schema.createTable('monthly_carryover', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('month', 7).notNullable() // Format: YYYY-MM
    table.decimal('carryover_amount', 10, 2).defaultTo(0)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.unique(['user_id', 'month'])
    table.index(['user_id', 'month'])
  })
}

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('monthly_carryover')
}

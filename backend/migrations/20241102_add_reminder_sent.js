/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
  await knex.schema.table('tasks', (table) => {
    table.boolean('reminder_sent').defaultTo(false)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
  await knex.schema.table('tasks', (table) => {
    table.dropColumn('reminder_sent')
  })
}

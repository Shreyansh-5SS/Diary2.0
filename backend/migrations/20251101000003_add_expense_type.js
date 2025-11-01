/**
 * Add type field to expenses table
 */

export async function up(knex) {
  await knex.schema.table('expenses', (table) => {
    table.string('type', 50).notNullable().defaultTo('expense').after('user_id')
  })
}

export async function down(knex) {
  await knex.schema.table('expenses', (table) => {
    table.dropColumn('type')
  })
}

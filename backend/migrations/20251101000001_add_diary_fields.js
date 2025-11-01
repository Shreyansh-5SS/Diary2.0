/**
 * Add starred and image_url columns to diary_entries
 */

export async function up(knex) {
  await knex.schema.table('diary_entries', (table) => {
    table.boolean('starred').defaultTo(false)
    table.string('image_url', 500)
  })
}

export async function down(knex) {
  await knex.schema.table('diary_entries', (table) => {
    table.dropColumn('starred')
    table.dropColumn('image_url')
  })
}

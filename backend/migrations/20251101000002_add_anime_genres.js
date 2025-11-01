/**
 * Add genres column to anime_list table
 */

export async function up(knex) {
  await knex.schema.table('anime_list', (table) => {
    table.json('genres').after('image_url')
  })
}

export async function down(knex) {
  await knex.schema.table('anime_list', (table) => {
    table.dropColumn('genres')
  })
}

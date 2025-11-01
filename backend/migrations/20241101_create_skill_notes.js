export function up(knex) {
  return knex.schema.createTable('skill_notes', (table) => {
    table.increments('id').primary()
    table.integer('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE')
    table.string('title', 255).notNullable()
    table.text('body')
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('skill_notes')
}

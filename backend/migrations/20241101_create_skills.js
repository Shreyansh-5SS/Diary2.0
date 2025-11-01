export function up(knex) {
  return knex.schema.createTable('skills', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.string('title', 255).notNullable()
    table.text('description')
    table.boolean('learned').defaultTo(false)
    table.integer('target_hours').defaultTo(0) // Target hours to master the skill
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('skills')
}

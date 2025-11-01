export function up(knex) {
  return knex.schema.createTable('timetable_slots', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.integer('day_of_week').notNullable() // 0=Sunday, 1=Monday, ..., 6=Saturday
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table.string('description', 500)
    table.boolean('is_free_time').defaultTo(false) // true if available for suggestions
    table.integer('task_id').references('id').inTable('tasks').onDelete('SET NULL')
    table.timestamps(true, true)
    
    table.index(['user_id', 'day_of_week'])
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('timetable_slots')
}

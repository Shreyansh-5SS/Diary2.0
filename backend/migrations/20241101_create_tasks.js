export function up(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('title', 255).notNullable()
    table.text('description')
    table.enum('status', ['backlog', 'in_progress', 'review', 'done']).defaultTo('backlog')
    table.string('group_name', 100)
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium')
    table.integer('estimate_mins')
    table.date('due_date')
    table.datetime('reminder_datetime')
    table.integer('position').defaultTo(0)
    table.timestamps(true, true)
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'status'])
    table.index(['user_id', 'group_name'])
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('tasks')
}

export function up(knex) {
  return knex.schema.createTable('pomodoro_sessions', function(table) {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.integer('task_id').unsigned()
    table.integer('skill_id').unsigned()
    table.integer('duration_mins').notNullable()
    table.datetime('started_at').notNullable()
    table.datetime('ended_at').notNullable()
    table.timestamps(true, true)
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.foreign('task_id').references('tasks.id').onDelete('SET NULL')
    table.foreign('skill_id').references('skills.id').onDelete('SET NULL')
    table.index(['user_id', 'started_at'])
    table.index(['skill_id'])
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('pomodoro_sessions')
}

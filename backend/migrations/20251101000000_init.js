/**
 * Initial database schema migration
 * Creates all core tables for Shreyansh Personal Diary
 */

export async function up(knex) {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('email', 255).notNullable().unique()
    table.string('password_hash', 255).notNullable()
    table.string('name', 100)
    table.string('avatar_url', 500)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  // Diary entries table
  await knex.schema.createTable('diary_entries', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('title', 200)
    table.text('content').notNullable()
    table.date('entry_date').notNullable()
    table.string('mood', 50)
    table.json('tags')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'entry_date'])
  })

  // Anime list table
  await knex.schema.createTable('anime_list', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('title', 200).notNullable()
    table.string('image_url', 500)
    table.string('status', 50).defaultTo('watching') // watching, completed, plan_to_watch, dropped
    table.integer('episodes_watched').defaultTo(0)
    table.integer('total_episodes')
    table.decimal('rating', 3, 1)
    table.text('notes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'status'])
  })

  // Expenses/Wallet table
  await knex.schema.createTable('expenses', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('category', 100).notNullable() // groceries, entertainment, transportation, etc.
    table.decimal('amount', 10, 2).notNullable()
    table.decimal('budget_limit', 10, 2)
    table.string('description', 500)
    table.date('expense_date').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'category', 'expense_date'])
  })

  // Tasks table
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('title', 200).notNullable()
    table.text('description')
    table.string('status', 50).defaultTo('pending') // pending, in_progress, completed
    table.string('priority', 50).defaultTo('medium') // low, medium, high
    table.date('due_date')
    table.json('tags')
    table.timestamp('completed_at')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'status', 'due_date'])
  })

  // Pomodoro sessions table
  await knex.schema.createTable('pomodoro_sessions', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.integer('task_id').unsigned()
    table.integer('duration_minutes').notNullable().defaultTo(25)
    table.string('session_type', 50).defaultTo('work') // work, short_break, long_break
    table.boolean('completed').defaultTo(false)
    table.timestamp('started_at').notNullable()
    table.timestamp('ended_at')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.foreign('task_id').references('tasks.id').onDelete('SET NULL')
    table.index(['user_id', 'started_at'])
  })

  // Skills table
  await knex.schema.createTable('skills', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('name', 100).notNullable()
    table.string('category', 100) // programming, design, language, etc.
    table.integer('proficiency').defaultTo(1) // 1-10 scale
    table.boolean('is_featured').defaultTo(false)
    table.integer('display_order').defaultTo(0)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'category'])
  })

  // Timetable slots table
  await knex.schema.createTable('timetable_slots', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('day_of_week', 20).notNullable() // monday, tuesday, etc.
    table.time('start_time').notNullable()
    table.time('end_time').notNullable()
    table.string('title', 200).notNullable()
    table.string('description', 500)
    table.string('color', 20).defaultTo('#ff6347')
    table.boolean('is_recurring').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'day_of_week'])
  })

  // Projects/Portfolio table
  await knex.schema.createTable('projects', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('title', 200).notNullable()
    table.text('description').notNullable()
    table.text('detailed_description')
    table.string('image_url', 500)
    table.json('tech_stack') // Array of technologies
    table.string('project_url', 500)
    table.string('github_url', 500)
    table.boolean('is_featured').defaultTo(false)
    table.integer('display_order').defaultTo(0)
    table.date('completed_date')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    table.foreign('user_id').references('users.id').onDelete('CASCADE')
    table.index(['user_id', 'is_featured'])
  })
}

export async function down(knex) {
  // Drop tables in reverse order to respect foreign key constraints
  await knex.schema.dropTableIfExists('projects')
  await knex.schema.dropTableIfExists('timetable_slots')
  await knex.schema.dropTableIfExists('skills')
  await knex.schema.dropTableIfExists('pomodoro_sessions')
  await knex.schema.dropTableIfExists('tasks')
  await knex.schema.dropTableIfExists('expenses')
  await knex.schema.dropTableIfExists('anime_list')
  await knex.schema.dropTableIfExists('diary_entries')
  await knex.schema.dropTableIfExists('users')
}

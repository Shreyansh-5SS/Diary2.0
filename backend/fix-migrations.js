import knex from 'knex'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function fixMigrations() {
  try {
    // Check current state
    const migrations = await db('knex_migrations').select('*')
    console.log('Current migrations:', migrations)
    
    // Insert migration records for pomodoro_sessions and skills if not present
    const pomodoroExists = migrations.some(m => m.name === '20241101_create_pomodoro_sessions.js')
    const skillsExists = migrations.some(m => m.name === '20241101_create_skills.js')
    const skillNotesExists = migrations.some(m => m.name === '20241101_create_skill_notes.js')
    
    if (!pomodoroExists) {
      await db('knex_migrations').insert({
        name: '20241101_create_pomodoro_sessions.js',
        batch: 8,
        migration_time: new Date()
      })
      console.log('Added pomodoro_sessions migration record')
    }
    
    if (!skillsExists) {
      await db('knex_migrations').insert({
        name: '20241101_create_skills.js',
        batch: 8,
        migration_time: new Date()
      })
      console.log('Added skills migration record')
    }
    
    if (!skillNotesExists) {
      await db('knex_migrations').insert({
        name: '20241101_create_skill_notes.js',
        batch: 8,
        migration_time: new Date()
      })
      console.log('Added skill_notes migration record')
    }
    
    // Now run the actual table creation
    console.log('\nCreating pomodoro_sessions table...')
    await db.schema.createTable('pomodoro_sessions', function(table) {
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
    console.log('pomodoro_sessions table created!')
    
    console.log('\nCreating skills table...')
    await db.schema.createTable('skills', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('title', 255).notNullable()
      table.text('description')
      table.boolean('learned').defaultTo(false)
      table.integer('target_hours').defaultTo(0)
      table.timestamps(true, true)
    })
    console.log('skills table created!')
    
    console.log('\nCreating skill_notes table...')
    await db.schema.createTable('skill_notes', (table) => {
      table.increments('id').primary()
      table.integer('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE')
      table.text('content').notNullable()
      table.timestamps(true, true)
    })
    console.log('skill_notes table created!')
    
    console.log('\n✅ All tables created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fixMigrations()

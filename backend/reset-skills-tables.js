import knex from 'knex'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function resetTables() {
  try {
    console.log('Dropping skill_notes table...')
    await db.schema.dropTableIfExists('skill_notes')
    
    console.log('Dropping skills table...')
    await db.schema.dropTableIfExists('skills')
    
    console.log('Dropping pomodoro_sessions table...')
    await db.schema.dropTableIfExists('pomodoro_sessions')
    
    console.log('All tables dropped successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

resetTables()

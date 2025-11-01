import knex from 'knex'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function fixDatabase() {
  try {
    console.log('Checking database tables...')
    
    // Check if users table exists
    const usersExists = await db.schema.hasTable('users')
    console.log('Users table exists:', usersExists)
    
    if (!usersExists) {
      console.log('\nCreating users table...')
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary()
        table.string('email', 255).notNullable().unique()
        table.string('password', 255).notNullable()
        table.string('name', 255)
        table.timestamps(true, true)
      })
      console.log('✅ Users table created!')
      
      // Mark the init migration as complete
      const migrationExists = await db('knex_migrations')
        .where('name', '20251101000000_init.js')
        .first()
      
      if (!migrationExists) {
        await db('knex_migrations').insert({
          name: '20251101000000_init.js',
          batch: 8,
          migration_time: new Date()
        })
        console.log('✅ Init migration marked as complete')
      }
    }
    
    // Check tasks table
    const tasksExists = await db.schema.hasTable('tasks')
    console.log('Tasks table exists:', tasksExists)
    
    if (tasksExists && !usersExists) {
      // Tasks existed but users didn't - mark tasks migration as complete
      const tasksMigrationExists = await db('knex_migrations')
        .where('name', '20241101_create_tasks.js')
        .first()
      
      if (!tasksMigrationExists) {
        await db('knex_migrations').insert({
          name: '20241101_create_tasks.js',
          batch: 8,
          migration_time: new Date()
        })
        console.log('✅ Tasks migration marked as complete')
      }
    }
    
    console.log('\n✅ Database fixed successfully!')
    console.log('\nCurrent migrations:')
    const migrations = await db('knex_migrations').select('*').orderBy('id')
    migrations.forEach(m => console.log(`  - ${m.name} (batch ${m.batch})`))
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

fixDatabase()

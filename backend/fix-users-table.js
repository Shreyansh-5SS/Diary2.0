import knex from 'knex'
import knexConfig from './knexfile.js'
import bcrypt from 'bcrypt'

const db = knex(knexConfig.development)

async function fixUsersTable() {
  try {
    console.log('Fixing users table...\n')
    
    // SQLite doesn't support ALTER COLUMN, so we need to recreate the table
    const users = await db('users').select('*')
    console.log(`Found ${users.length} existing users`)
    
    // Drop and recreate users table with correct schema
    await db.schema.dropTable('users')
    console.log('Dropped old users table')
    
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('password_hash', 255).notNullable()
      table.string('name', 100)
      table.string('avatar_url', 500)
      table.timestamp('created_at').defaultTo(db.fn.now())
      table.timestamp('updated_at').defaultTo(db.fn.now())
    })
    console.log('Created new users table with password_hash column\n')
    
    // Restore users (if any)
    for (const user of users) {
      await db('users').insert({
        ...user,
        password_hash: user.password || user.password_hash
      })
      console.log(`Restored user: ${user.email}`)
    }
    
    // Create demo user
    const demoExists = await db('users').where('email', 'demo@local').first()
    if (!demoExists) {
      const passwordHash = await bcrypt.hash('demo123', 10)
      await db('users').insert({
        email: 'demo@local',
        password_hash: passwordHash,
        name: 'Demo User'
      })
      console.log('\n✅ Demo user created!')
      console.log('   Email: demo@local')
      console.log('   Password: demo123')
    } else {
      console.log('\n✅ Demo user already exists')
    }
    
    console.log('\n✅ Users table fixed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixUsersTable()

import knex from 'knex'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function recreateAllTables() {
  try {
    console.log('🔧 Recreating all database tables...\n')
    
    // Check what exists
    const tables = ['diary_entries', 'anime_list', 'expenses', 'tasks']
    
    for (const table of tables) {
      const exists = await db.schema.hasTable(table)
      if (exists) {
        console.log(`Dropping ${table} table...`)
        await db.schema.dropTable(table)
      }
    }
    
    // Create diary_entries
    console.log('\nCreating diary_entries table...')
    await db.schema.createTable('diary_entries', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('title', 200)
      table.text('content').notNullable()
      table.date('entry_date').notNullable()
      table.string('mood', 50)
      table.json('tags')
      table.timestamp('created_at').defaultTo(db.fn.now())
      table.timestamp('updated_at').defaultTo(db.fn.now())
      
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.index(['user_id', 'entry_date'])
    })
    console.log('✅ diary_entries created')
    
    // Create anime_list
    console.log('Creating anime_list table...')
    await db.schema.createTable('anime_list', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('title', 200).notNullable()
      table.string('image_url', 500)
      table.string('status', 50).defaultTo('watching')
      table.integer('episodes_watched').defaultTo(0)
      table.integer('total_episodes')
      table.decimal('rating', 3, 1)
      table.text('notes')
      table.timestamp('created_at').defaultTo(db.fn.now())
      table.timestamp('updated_at').defaultTo(db.fn.now())
      
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.index(['user_id', 'status'])
    })
    console.log('✅ anime_list created')
    
    // Create expenses
    console.log('Creating expenses table...')
    await db.schema.createTable('expenses', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('category', 100).notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.decimal('budget_limit', 10, 2)
      table.string('description', 500)
      table.date('expense_date').notNullable()
      table.timestamp('created_at').defaultTo(db.fn.now())
      
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.index(['user_id', 'category', 'expense_date'])
    })
    console.log('✅ expenses created')
    
    // Create tasks
    console.log('Creating tasks table...')
    await db.schema.createTable('tasks', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('title', 200).notNullable()
      table.text('description')
      table.string('status', 50).defaultTo('pending')
      table.string('priority', 50).defaultTo('medium')
      table.date('due_date')
      table.json('tags')
      table.timestamp('completed_at')
      table.timestamp('created_at').defaultTo(db.fn.now())
      table.timestamp('updated_at').defaultTo(db.fn.now())
      
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.index(['user_id', 'status', 'due_date'])
    })
    console.log('✅ tasks created')
    
    // Mark tasks migration as complete
    const tasksMigExists = await db('knex_migrations')
      .where('name', '20241101_create_tasks.js')
      .first()
    
    if (!tasksMigExists) {
      await db('knex_migrations').insert({
        name: '20241101_create_tasks.js',
        batch: 8,
        migration_time: new Date()
      })
      console.log('✅ Tasks migration marked as complete')
    }
    
    console.log('\n✅ All tables created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

recreateAllTables()

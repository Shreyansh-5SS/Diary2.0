import knex from 'knex'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function addTaskColumns() {
  try {
    console.log('Adding missing columns to tasks table...\n')
    
    const hasGroupName = await db.schema.hasColumn('tasks', 'group_name')
    if (!hasGroupName) {
      await db.schema.table('tasks', (table) => {
        table.string('group_name', 100)
      })
      console.log('✅ Added group_name column')
    }
    
    const hasEstimateMins = await db.schema.hasColumn('tasks', 'estimate_mins')
    if (!hasEstimateMins) {
      await db.schema.table('tasks', (table) => {
        table.integer('estimate_mins')
      })
      console.log('✅ Added estimate_mins column')
    }
    
    const hasReminderDatetime = await db.schema.hasColumn('tasks', 'reminder_datetime')
    if (!hasReminderDatetime) {
      await db.schema.table('tasks', (table) => {
        table.datetime('reminder_datetime')
      })
      console.log('✅ Added reminder_datetime column')
    }
    
    const hasPosition = await db.schema.hasColumn('tasks', 'position')
    if (!hasPosition) {
      await db.schema.table('tasks', (table) => {
        table.integer('position').defaultTo(0)
      })
      console.log('✅ Added position column')
    }
    
    console.log('\n✅ All missing columns added successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

addTaskColumns()

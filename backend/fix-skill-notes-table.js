import knex from 'knex'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function fixSkillNotesTable() {
  try {
    console.log('Fixing skill_notes table...\n')
    
    // Get existing notes
    const existingNotes = await db('skill_notes').select('*')
    console.log(`Found ${existingNotes.length} existing notes`)
    
    // Drop and recreate with correct schema
    await db.schema.dropTable('skill_notes')
    console.log('Dropped old skill_notes table')
    
    await db.schema.createTable('skill_notes', (table) => {
      table.increments('id').primary()
      table.integer('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE')
      table.string('title', 255).notNullable()
      table.text('body')
      table.timestamps(true, true)
    })
    console.log('Created new skill_notes table with title and body columns\n')
    
    // Restore notes (convert content to title)
    for (const note of existingNotes) {
      await db('skill_notes').insert({
        skill_id: note.skill_id,
        title: note.content.substring(0, 100), // Use first 100 chars as title
        body: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at
      })
      console.log(`Restored note for skill ${note.skill_id}`)
    }
    
    console.log('\n✅ skill_notes table fixed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

fixSkillNotesTable()

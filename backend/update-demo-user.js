import knex from 'knex'
import bcrypt from 'bcrypt'
import knexConfig from './knexfile.js'

const db = knex(knexConfig.development)

async function updateDemoUser() {
  try {
    // Check if user exists
    const existingUser = await db('users')
      .where({ email: 'demo@local' })
      .first()

    if (!existingUser) {
      console.log('❌ Demo user not found')
      console.log('Creating new user...')
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('Ansh05@jee', 10)
      
      // Create new user
      await db('users').insert({
        email: 'singhshreyansh0505@gmail.com',
        password_hash: hashedPassword,
        name: 'Shreyansh Singh'
      })
      
      console.log('✅ New user created successfully!')
    } else {
      console.log('📧 Current user:', existingUser.email)

      // Hash the new password
      const hashedPassword = await bcrypt.hash('Ansh05@jee', 10)

      // Update user
      await db('users')
        .where({ email: 'demo@local' })
        .update({
          email: 'singhshreyansh0505@gmail.com',
          password_hash: hashedPassword,
          name: 'Shreyansh Singh'
        })

      console.log('✅ User updated successfully!')
    }

    const updatedUser = await db('users')
      .where({ email: 'singhshreyansh0505@gmail.com' })
      .first()

    console.log('📧 Email:', updatedUser.email)
    console.log('� Name:', updatedUser.name)
    console.log('🔑 Password: Ansh05@jee')
    console.log('\n📝 Login credentials:')
    console.log('   Email: singhshreyansh0505@gmail.com')
    console.log('   Password: Ansh05@jee')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating user:', error)
    process.exit(1)
  }
}

updateDemoUser()

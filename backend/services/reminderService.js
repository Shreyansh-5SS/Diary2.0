import cron from 'node-cron'
import nodemailer from 'nodemailer'
import knex from 'knex'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.development)

// Create email transporter
// Use console transport for development, SendGrid for production
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Production: SendGrid
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    })
  } else {
    // Development: Console transport (logs to terminal)
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    })
  }
}

// Send reminder email
const sendReminderEmail = async (task, user) => {
  const transporter = createTransporter()
  const isProduction = !!process.env.SENDGRID_API_KEY

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@diary2.app',
    to: user.email,
    subject: `Reminder: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000; border-bottom: 3px solid #000; padding-bottom: 10px;">
          📌 Task Reminder
        </h2>
        <div style="padding: 20px; background: #fef3c7; border: 3px solid #000; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">${task.title}</h3>
          ${task.description ? `<p style="margin: 10px 0; color: #333;">${task.description}</p>` : ''}
          <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #000;">
            <p style="margin: 5px 0;"><strong>Priority:</strong> ${task.priority.toUpperCase()}</p>
            ${task.group_name ? `<p style="margin: 5px 0;"><strong>Group:</strong> ${task.group_name}</p>` : ''}
            ${task.estimate_mins ? `<p style="margin: 5px 0;"><strong>Estimate:</strong> ${task.estimate_mins} mins</p>` : ''}
            ${task.due_date ? `<p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>` : ''}
          </div>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This is an automated reminder from your Diary2.0 WorkDesk.
        </p>
      </div>
    `,
    text: `
Task Reminder: ${task.title}

${task.description || ''}

Priority: ${task.priority.toUpperCase()}
${task.group_name ? `Group: ${task.group_name}` : ''}
${task.estimate_mins ? `Estimate: ${task.estimate_mins} mins` : ''}
${task.due_date ? `Due Date: ${new Date(task.due_date).toLocaleDateString()}` : ''}

---
This is an automated reminder from your Diary2.0 WorkDesk.
    `
  }

  try {
    if (isProduction) {
      // Production: Actually send email
      const info = await transporter.sendMail(mailOptions)
      console.log(`✅ Reminder email sent to ${user.email} for task: ${task.title}`)
      console.log(`   Message ID: ${info.messageId}`)
    } else {
      // Development: Log to console
      const info = await transporter.sendMail(mailOptions)
      console.log('\n' + '='.repeat(80))
      console.log('📧 EMAIL SENT (CONSOLE TRANSPORT - DEV MODE)')
      console.log('='.repeat(80))
      console.log(`To: ${user.email}`)
      console.log(`Subject: ${mailOptions.subject}`)
      console.log(`Task ID: ${task.id}`)
      console.log(`Task Title: ${task.title}`)
      console.log(`Priority: ${task.priority.toUpperCase()}`)
      console.log(`Reminder Time: ${task.reminder_datetime}`)
      console.log('-'.repeat(80))
      console.log('Email Body (Plain Text):')
      console.log(mailOptions.text)
      console.log('='.repeat(80) + '\n')
    }

    // Mark reminder as sent
    await db('tasks')
      .where({ id: task.id })
      .update({ reminder_sent: true })

    return true
  } catch (error) {
    console.error(`❌ Error sending reminder email for task ${task.id}:`, error)
    return false
  }
}

// Check for pending reminders
const checkReminders = async () => {
  try {
    const now = new Date().toISOString()

    // Find tasks with reminders that haven't been sent yet
    const tasksWithReminders = await db('tasks')
      .select('tasks.*', 'users.email', 'users.username')
      .join('users', 'tasks.user_id', 'users.id')
      .where('tasks.reminder_datetime', '<=', now)
      .where('tasks.reminder_sent', false)
      .whereNotNull('tasks.reminder_datetime')

    if (tasksWithReminders.length === 0) {
      return
    }

    console.log(`\n🔔 Found ${tasksWithReminders.length} reminder(s) to send...`)

    for (const task of tasksWithReminders) {
      const user = {
        email: task.email,
        username: task.username
      }

      await sendReminderEmail(task, user)
    }
  } catch (error) {
    console.error('❌ Error checking reminders:', error)
  }
}

// Start cron job - runs every minute
export const startReminderCron = () => {
  console.log('⏰ Starting reminder cron job (runs every minute)...')

  // Schedule: every minute
  cron.schedule('* * * * *', () => {
    checkReminders()
  })
}

// Manual test function
export const sendTestEmail = async (userId) => {
  try {
    const user = await db('users')
      .where({ id: userId })
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    const testTask = {
      id: 0,
      title: 'Test Reminder Email',
      description: 'This is a test email from your Diary2.0 WorkDesk reminder system.',
      priority: 'medium',
      group_name: 'Testing',
      estimate_mins: 30,
      due_date: new Date().toISOString(),
      reminder_datetime: new Date().toISOString()
    }

    await sendReminderEmail(testTask, user)
    return true
  } catch (error) {
    console.error('Error sending test email:', error)
    throw error
  }
}

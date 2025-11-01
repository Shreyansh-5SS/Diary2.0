import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { sendTestEmail } from '../services/reminderService.js'

const router = express.Router()

// Test email endpoint
router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    await sendTestEmail(req.user.id)
    res.json({ 
      message: 'Test email sent successfully. Check server console for output.',
      mode: process.env.SENDGRID_API_KEY ? 'production (SendGrid)' : 'development (console)'
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    res.status(500).json({ error: 'Failed to send test email' })
  }
})

export default router

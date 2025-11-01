import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import diaryRoutes from './routes/diaryRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import animeRoutes from './routes/animeRoutes.js'
import expensesRoutes from './routes/expensesRoutes.js'
import tasksRoutes from './routes/tasks.js'
import pomodoroRoutes from './routes/pomodoro.js'
import { authMiddleware } from './middleware/auth.js'
import { getCurrentUser } from './controllers/authController.js'

dotenv.config()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/diary', diaryRoutes)
app.use('/api/anime', animeRoutes)
app.use('/api/expenses', expensesRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/pomodoro', pomodoroRoutes)
app.use('/api/uploads', uploadRoutes)
app.get('/api/me', authMiddleware, getCurrentUser)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

export default app

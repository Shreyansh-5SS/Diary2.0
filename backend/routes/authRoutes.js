import express from 'express'
import { register, login, getCurrentUser } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

/**
 * Auth Routes
 */

// POST /api/auth/register - Register new user
router.post('/register', register)

// POST /api/auth/login - Login user
router.post('/login', login)

export default router

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import knex from 'knex'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.development)

/**
 * Generate JWT token
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Password must be at least 6 characters'
      })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid email format'
      })
    }

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email: email.toLowerCase() })
      .first()

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const [userId] = await db('users').insert({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name: name || null
    })

    // Get created user
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'email', 'name', 'created_at')
      .first()

    // Generate token
    const token = generateToken(user.id, user.email)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    })
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      })
    }

    // Find user
    const user = await db('users')
      .where({ email: email.toLowerCase() })
      .first()

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      })
    }

    // Generate token
    const token = generateToken(user.id, user.email)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    })
  }
}

/**
 * Get current user
 * GET /api/me (protected)
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'name', 'avatar_url', 'created_at', 'updated_at')
      .first()

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      })
    }

    res.json({
      user
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    })
  }
}

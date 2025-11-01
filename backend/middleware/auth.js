import jwt from 'jsonwebtoken'

/**
 * Auth middleware - Verifies JWT token and sets req.user
 * Protects routes that require authentication
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization header must be in format: Bearer <token>'
      })
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7)

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      })
    }

    return res.status(500).json({
      error: 'Authentication error',
      message: error.message
    })
  }
}

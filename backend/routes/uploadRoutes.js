import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const router = express.Router()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const nameWithoutExt = path.basename(file.originalname, ext)
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`)
  }
})

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'))
  }
}

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

/**
 * Upload local image
 * POST /api/uploads/local
 */
router.post('/local', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select an image file'
      })
    }

    // Return the static URL for the uploaded file
    const imageUrl = `/uploads/${req.file.filename}`

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    })
  }
})

// Error handler for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image must be smaller than 5MB'
      })
    }
    return res.status(400).json({
      error: 'Upload error',
      message: error.message
    })
  }
  next(error)
})

export default router

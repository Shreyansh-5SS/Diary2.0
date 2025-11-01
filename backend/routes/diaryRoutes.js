import express from 'express'
import {
  getDiaryEntries,
  getDiaryEntry,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry
} from '../controllers/diaryController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All diary routes require authentication
router.use(authMiddleware)

/**
 * Diary Routes
 */

// GET /api/diary - Get all diary entries (with optional filters)
router.get('/', getDiaryEntries)

// GET /api/diary/:id - Get single diary entry
router.get('/:id', getDiaryEntry)

// POST /api/diary - Create new diary entry
router.post('/', createDiaryEntry)

// PUT /api/diary/:id - Update diary entry
router.put('/:id', updateDiaryEntry)

// DELETE /api/diary/:id - Delete diary entry
router.delete('/:id', deleteDiaryEntry)

export default router

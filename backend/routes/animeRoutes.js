import express from 'express'
import {
  getAnimeList,
  getAnimeEntry,
  createAnimeEntry,
  updateAnimeEntry,
  deleteAnimeEntry
} from '../controllers/animeController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All anime routes require authentication
router.use(authMiddleware)

/**
 * Anime Routes
 */

// GET /api/anime - Get all anime entries (with optional filters)
router.get('/', getAnimeList)

// GET /api/anime/:id - Get single anime entry
router.get('/:id', getAnimeEntry)

// POST /api/anime - Create new anime entry
router.post('/', createAnimeEntry)

// PUT /api/anime/:id - Update anime entry
router.put('/:id', updateAnimeEntry)

// DELETE /api/anime/:id - Delete anime entry
router.delete('/:id', deleteAnimeEntry)

export default router

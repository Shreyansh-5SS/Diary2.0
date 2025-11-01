import express from 'express'
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary
} from '../controllers/expensesController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Get monthly summary
router.get('/summary', getSummary)

// CRUD operations
router.get('/', getExpenses)
router.get('/:id', getExpense)
router.post('/', createExpense)
router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)

export default router

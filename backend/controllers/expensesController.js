import knex from 'knex'
import knexConfig from '../knexfile.js'

const db = knex(knexConfig.development)

/**
 * Get all expenses for the authenticated user
 * Optional query params: month (YYYY-MM), type (earning/expense), category
 */
export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id
    const { month, type, category } = req.query

    let query = db('expenses').where({ user_id: userId })

    // Filter by month if provided
    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = `${year}-${monthNum}-01`
      const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0]
      query = query.whereBetween('expense_date', [startDate, endDate])
    }

    // Filter by type if provided
    if (type && ['earning', 'expense'].includes(type)) {
      query = query.where({ type })
    }

    // Filter by category if provided
    if (category) {
      query = query.where({ category })
    }

    const expenses = await query.orderBy('expense_date', 'desc').orderBy('created_at', 'desc')

    res.json(expenses)
  } catch (error) {
    console.error('Get expenses error:', error)
    res.status(500).json({ error: 'Failed to fetch expenses', message: error.message })
  }
}

/**
 * Get a single expense by ID
 */
export const getExpense = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const expense = await db('expenses')
      .where({ id, user_id: userId })
      .first()

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    res.json(expense)
  } catch (error) {
    console.error('Get expense error:', error)
    res.status(500).json({ error: 'Failed to fetch expense', message: error.message })
  }
}

/**
 * Create a new expense entry
 */
export const createExpense = async (req, res) => {
  try {
    const userId = req.user.id
    const { type, category, amount, description, expense_date, budget_limit } = req.body

    // Validation
    if (!type || !['earning', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "earning" or "expense"' })
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'Category is required' })
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' })
    }

    if (!expense_date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    const [id] = await db('expenses').insert({
      user_id: userId,
      type,
      category: category.trim(),
      amount: parseFloat(amount),
      description: description?.trim() || null,
      expense_date,
      budget_limit: budget_limit ? parseFloat(budget_limit) : null
    })

    const newExpense = await db('expenses').where({ id }).first()

    res.status(201).json(newExpense)
  } catch (error) {
    console.error('Create expense error:', error)
    res.status(500).json({ error: 'Failed to create expense', message: error.message })
  }
}

/**
 * Update an existing expense
 */
export const updateExpense = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { type, category, amount, description, expense_date, budget_limit } = req.body

    // Check if expense exists and belongs to user
    const expense = await db('expenses')
      .where({ id, user_id: userId })
      .first()

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    // Validation
    if (type && !['earning', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "earning" or "expense"' })
    }

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' })
    }

    const updates = {}
    if (type) updates.type = type
    if (category) updates.category = category.trim()
    if (amount) updates.amount = parseFloat(amount)
    if (description !== undefined) updates.description = description?.trim() || null
    if (expense_date) updates.expense_date = expense_date
    if (budget_limit !== undefined) updates.budget_limit = budget_limit ? parseFloat(budget_limit) : null

    await db('expenses')
      .where({ id, user_id: userId })
      .update(updates)

    const updatedExpense = await db('expenses').where({ id }).first()

    res.json(updatedExpense)
  } catch (error) {
    console.error('Update expense error:', error)
    res.status(500).json({ error: 'Failed to update expense', message: error.message })
  }
}

/**
 * Delete an expense
 */
export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const expense = await db('expenses')
      .where({ id, user_id: userId })
      .first()

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' })
    }

    await db('expenses')
      .where({ id, user_id: userId })
      .delete()

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Delete expense error:', error)
    res.status(500).json({ error: 'Failed to delete expense', message: error.message })
  }
}

/**
 * Get monthly summary with totals and category breakdown
 * Query param: month (YYYY-MM, defaults to current month)
 */
export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id
    let { month } = req.query

    // Default to current month if not provided
    if (!month) {
      const now = new Date()
      const year = now.getFullYear()
      const monthNum = String(now.getMonth() + 1).padStart(2, '0')
      month = `${year}-${monthNum}`
    }

    const [year, monthNum] = month.split('-')
    const startDate = `${year}-${monthNum}-01`
    const endDate = new Date(year, monthNum, 0).toISOString().split('T')[0]

    // Get all transactions for the month
    const transactions = await db('expenses')
      .where({ user_id: userId })
      .whereBetween('expense_date', [startDate, endDate])

    // Calculate totals
    const earnings = transactions
      .filter(t => t.type === 'earning')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const savings = earnings - expenses

    // Category breakdown (expenses only)
    const categoryBreakdown = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = {
            category: cat,
            total: 0,
            count: 0,
            budget_limit: t.budget_limit
          }
        }
        categoryBreakdown[cat].total += parseFloat(t.amount)
        categoryBreakdown[cat].count += 1
      })

    // Convert to array and sort by total
    const categories = Object.values(categoryBreakdown)
      .sort((a, b) => b.total - a.total)

    res.json({
      month,
      totals: {
        earnings: parseFloat(earnings.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        savings: parseFloat(savings.toFixed(2))
      },
      categories,
      transactionCount: transactions.length
    })
  } catch (error) {
    console.error('Get summary error:', error)
    res.status(500).json({ error: 'Failed to fetch summary', message: error.message })
  }
}

import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/ExpenseModal.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const EXPENSE_CATEGORIES = [
  'Groceries',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Bills & Utilities',
  'Rent',
  'Dining Out',
  'Other'
]

const EARNING_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Refund',
  'Other'
]

export default function ExpenseModal({ expense, onClose, onSave }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    budget_limit: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (expense) {
      setFormData({
        type: expense.type || 'expense',
        category: expense.category || '',
        amount: expense.amount?.toString() || '',
        description: expense.description || '',
        expense_date: expense.expense_date || new Date().toISOString().split('T')[0],
        budget_limit: expense.budget_limit?.toString() || ''
      })
    }
  }, [expense])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.type) {
      setError('Type is required')
      return
    }

    if (!formData.category) {
      setError('Category is required')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (!formData.expense_date) {
      setError('Date is required')
      return
    }

    setSaving(true)

    try {
      const payload = {
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        expense_date: formData.expense_date,
        budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : undefined
      }

      if (expense) {
        await axios.put(`${API_URL}/api/expenses/${expense.id}`, payload)
      } else {
        await axios.post(`${API_URL}/api/expenses`, payload)
      }

      onSave()
    } catch (error) {
      console.error('Save failed:', error)
      setError(error.response?.data?.error || 'Failed to save transaction')
    } finally {
      setSaving(false)
    }
  }

  const categories = formData.type === 'earning' ? EARNING_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {expense ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Type *</label>
            <div className={styles.typeButtons}>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`${styles.typeButton} ${
                  formData.type === 'expense' ? styles.typeButtonActive : ''
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('earning')}
                className={`${styles.typeButton} ${
                  formData.type === 'earning' ? styles.typeButtonActive : ''
                }`}
              >
                Earning
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="amount" className={styles.label}>
              Amount (₹) *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              className={styles.input}
              placeholder="0.00"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="expense_date" className={styles.label}>
              Date *
            </label>
            <input
              id="expense_date"
              name="expense_date"
              type="date"
              value={formData.expense_date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          {formData.type === 'expense' && (
            <div className={styles.field}>
              <label htmlFor="budget_limit" className={styles.label}>
                Budget Limit (₹)
              </label>
              <input
                id="budget_limit"
                name="budget_limit"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget_limit}
                onChange={handleChange}
                className={styles.input}
                placeholder="Optional"
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
              placeholder="Add notes about this transaction..."
            />
          </div>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

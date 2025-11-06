import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useAuth } from '../context/AuthContext'
import ExpenseModal from '../components/ExpenseModal'
import styles from '../styles/Expenses.module.css'
import globalStyles from '../styles/global.module.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const CHART_COLORS = [
  '#FF6347', '#4169E1', '#32CD32', '#FFD700', '#9370DB',
  '#FF69B4', '#20B2AA', '#FF8C00', '#8B4513', '#00CED1'
]

export default function Expenses() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filterType, setFilterType] = useState('all') // all, earning, expense

  // Function definitions BEFORE useEffect and early returns
  const fetchData = async () => {
    setLoading(true)
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/expenses`, {
          params: { month: selectedMonth }
        }),
        axios.get(`${API_URL}/api/expenses/summary`, {
          params: { month: selectedMonth }
        })
      ])
      
      setExpenses(expensesRes.data)
      setSummary(summaryRes.data)
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingExpense(null)
    setShowModal(true)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`)
      fetchData()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete transaction')
    }
  }

  const handleSave = () => {
    setShowModal(false)
    setEditingExpense(null)
    fetchData()
  }

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('No transactions to export')
      return
    }

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description']
    const rows = expenses.map(exp => [
      exp.expense_date,
      exp.type,
      exp.category,
      exp.amount,
      exp.description || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expenses-${selectedMonth}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImportCSV = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    const formData = new FormData()
    formData.append('csvFile', file)

    try {
      const response = await axios.post(`${API_URL}/api/expenses/import-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert(`Success! Imported ${response.data.imported} transactions`)
      fetchData()
      
      // Reset file input
      event.target.value = ''
    } catch (error) {
      console.error('CSV import failed:', error)
      const errorMsg = error.response?.data?.error || 'Failed to import CSV'
      const details = error.response?.data?.errors?.join('\n') || ''
      alert(`${errorMsg}${details ? '\n\n' + details : ''}`)
    }
  }

  const getChartData = () => {
    if (!summary || !summary.categories || summary.categories.length === 0) {
      return null
    }

    return {
      labels: summary.categories.map(cat => cat.category),
      datasets: [{
        data: summary.categories.map(cat => cat.total),
        backgroundColor: CHART_COLORS.slice(0, summary.categories.length),
        borderColor: '#1a1a1a',
        borderWidth: 1
      }]
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          padding: 15,
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`
          }
        }
      }
    }
  }

  const filteredExpenses = filterType === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.type === filterType)

  // useEffect and early returns AFTER all function definitions
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    fetchData()
  }, [user, selectedMonth, navigate, location])

  if (loading && !summary) {
    return <div className={styles.loading}>Loading expenses...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className={globalStyles.homePageBackground}>
      <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Wallet & Expenses</h1>
        <div className={styles.headerActions}>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles.monthPicker}
          />
          <label htmlFor="csv-import" className={styles.importButton}>
            Import CSV
            <input
              id="csv-import"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={handleExportCSV} className={styles.exportButton}>
            Export CSV
          </button>
          <button onClick={handleCreate} className={styles.addButton}>
            Add Transaction
          </button>
        </div>
      </div>

      {summary && (
        <>
          <div className={styles.summaryCards}>
            <div className={`${styles.summaryCard} ${styles.earningsCard}`}>
              <div className={styles.cardLabel}>Earnings</div>
              <div className={styles.cardAmount}>₹{summary.totals.earnings.toFixed(2)}</div>
            </div>
            <div className={`${styles.summaryCard} ${styles.expensesCard}`}>
              <div className={styles.cardLabel}>Expenses</div>
              <div className={styles.cardAmount}>₹{summary.totals.expenses.toFixed(2)}</div>
            </div>
            <div className={`${styles.summaryCard} ${styles.savingsCard}`}>
              <div className={styles.cardLabel}>This Month's Savings</div>
              <div className={styles.cardAmount}>₹{summary.totals.savings.toFixed(2)}</div>
              <div className={styles.savingsPercentage}>
                {summary.totals.earnings > 0
                  ? `${((summary.totals.savings / summary.totals.earnings) * 100).toFixed(1)}%`
                  : '0%'}
              </div>
            </div>
            {summary.carryoverInfo && summary.carryoverInfo.amount !== 0 && (
              <div className={`${styles.summaryCard} ${styles.carryoverCard}`}>
                <div className={styles.cardLabel}>Total Balance</div>
                <div className={styles.cardAmount}>₹{summary.totals.totalBalance.toFixed(2)}</div>
                <div className={styles.carryoverNote}>
                  Includes ₹{summary.carryoverInfo.amount.toFixed(2)} from {summary.carryoverInfo.previousMonth}
                </div>
              </div>
            )}
          </div>

          {summary.categories && summary.categories.length > 0 && (
            <div className={styles.breakdown}>
              <div className={styles.breakdownSection}>
                <h2 className={styles.sectionTitle}>Category Breakdown</h2>
                <div className={styles.categoryBars}>
                  {summary.categories.map((cat, index) => {
                    const percentage = summary.totals.expenses > 0
                      ? (cat.total / summary.totals.expenses) * 100
                      : 0
                    
                    return (
                      <div key={cat.category} className={styles.categoryBar}>
                        <div className={styles.categoryHeader}>
                          <span className={styles.categoryName}>{cat.category}</span>
                          <span className={styles.categoryAmount}>
                            ₹{cat.total.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className={styles.barContainer}>
                          <div
                            className={styles.barFill}
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                            }}
                          />
                        </div>
                        {cat.budget_limit && (
                          <div className={styles.budgetInfo}>
                            Budget: ₹{cat.budget_limit} 
                            {cat.total > cat.budget_limit && (
                              <span className={styles.overBudget}> (Over budget!)</span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={styles.chartSection}>
                <h2 className={styles.sectionTitle}>Distribution</h2>
                <div className={styles.chartContainer}>
                  {getChartData() ? (
                    <Pie data={getChartData()} options={chartOptions} />
                  ) : (
                    <div className={styles.noData}>No expense data</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className={styles.transactionsSection}>
        <div className={styles.transactionsHeader}>
          <h2 className={styles.sectionTitle}>Transactions</h2>
          <div className={styles.filterButtons}>
            <button
              onClick={() => setFilterType('all')}
              className={`${styles.filterButton} ${filterType === 'all' ? styles.active : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('earning')}
              className={`${styles.filterButton} ${filterType === 'earning' ? styles.active : ''}`}
            >
              Earnings
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`${styles.filterButton} ${filterType === 'expense' ? styles.active : ''}`}
            >
              Expenses
            </button>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No transactions yet</p>
            <p className={styles.emptyText}>
              {filterType === 'all'
                ? 'Add your first transaction to start tracking your finances'
                : `No ${filterType}s found for this month`}
            </p>
          </div>
        ) : (
          <div className={styles.transactionsList}>
            {filteredExpenses.map(expense => (
              <div key={expense.id} className={styles.transactionCard}>
                <div className={styles.transactionMain}>
                  <div className={styles.transactionDate}>
                    {new Date(expense.expense_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className={styles.transactionDetails}>
                    <div className={styles.transactionCategory}>{expense.category}</div>
                    {expense.description && (
                      <div className={styles.transactionDescription}>{expense.description}</div>
                    )}
                  </div>
                  <div className={`${styles.transactionAmount} ${
                    expense.type === 'earning' ? styles.earning : styles.expense
                  }`}>
                    {expense.type === 'earning' ? '+' : '-'}₹{expense.amount}
                  </div>
                </div>
                <div className={styles.transactionActions}>
                  <button
                    onClick={() => handleEdit(expense)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => {
            setShowModal(false)
            setEditingExpense(null)
          }}
          onSave={handleSave}
        />
      )}
      </div>
    </div>
  )
}

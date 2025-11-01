import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './TaskModal.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function TaskModal({ task, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'backlog',
    group_name: '',
    priority: 'medium',
    estimate_mins: '',
    due_date: '',
    reminder_datetime: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'backlog',
        group_name: task.group_name || '',
        priority: task.priority || 'medium',
        estimate_mins: task.estimate_mins || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        reminder_datetime: task.reminder_datetime ? task.reminder_datetime.slice(0, 16) : ''
      })
    }
  }, [task])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters'
    }

    if (formData.estimate_mins && (isNaN(formData.estimate_mins) || formData.estimate_mins < 0)) {
      newErrors.estimate_mins = 'Estimate must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        group_name: formData.group_name.trim() || null,
        priority: formData.priority,
        estimate_mins: formData.estimate_mins ? parseInt(formData.estimate_mins) : null,
        due_date: formData.due_date || null,
        reminder_datetime: formData.reminder_datetime || null
      }

      if (task) {
        // Update existing task
        await axios.put(
          `${API_URL}/api/tasks/${task.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        // Create new task
        await axios.post(
          `${API_URL}/api/tasks`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      onClose(true) // true = should refresh
    } catch (err) {
      console.error('Error saving task:', err)
      if (err.response?.data?.error) {
        setErrors({ submit: err.response.data.error })
      } else {
        setErrors({ submit: 'Failed to save task' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={() => onClose(false)}
            aria-label="Close modal"
            tabIndex={0}
          >
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={styles.input}
              value={formData.title}
              onChange={handleChange}
              maxLength={255}
              required
              tabIndex={0}
            />
            {errors.title && <span className={styles.errorText}>{errors.title}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
              rows={4}
              tabIndex={0}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.label}>
                Status
              </label>
              <select
                id="status"
                name="status"
                className={styles.select}
                value={formData.status}
                onChange={handleChange}
                tabIndex={0}
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority" className={styles.label}>
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className={styles.select}
                value={formData.priority}
                onChange={handleChange}
                tabIndex={0}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="group_name" className={styles.label}>
                Group
              </label>
              <input
                type="text"
                id="group_name"
                name="group_name"
                className={styles.input}
                value={formData.group_name}
                onChange={handleChange}
                placeholder="e.g., Frontend, Backend"
                maxLength={100}
                tabIndex={0}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="estimate_mins" className={styles.label}>
                Estimate (mins)
              </label>
              <input
                type="number"
                id="estimate_mins"
                name="estimate_mins"
                className={styles.input}
                value={formData.estimate_mins}
                onChange={handleChange}
                min="0"
                placeholder="60"
                tabIndex={0}
              />
              {errors.estimate_mins && <span className={styles.errorText}>{errors.estimate_mins}</span>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="due_date" className={styles.label}>
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                className={styles.input}
                value={formData.due_date}
                onChange={handleChange}
                tabIndex={0}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reminder_datetime" className={styles.label}>
                Reminder
              </label>
              <input
                type="datetime-local"
                id="reminder_datetime"
                name="reminder_datetime"
                className={styles.input}
                value={formData.reminder_datetime}
                onChange={handleChange}
                tabIndex={0}
              />
            </div>
          </div>

          {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => onClose(false)}
              tabIndex={0}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
              tabIndex={0}
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal

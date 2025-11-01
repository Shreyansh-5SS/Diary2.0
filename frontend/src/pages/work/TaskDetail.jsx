import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styles from './TaskDetail.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function TaskDetail({ task, onClose, onEdit, onDelete, onUpdate }) {
  const [currentStatus, setCurrentStatus] = useState(task.status)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_URL}/api/tasks/${task.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCurrentStatus(newStatus)
      onUpdate()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return null
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#ca8a04'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="detail-title" className={styles.title}>Task Details</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close task details"
            tabIndex={0}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            {task.description && (
              <p className={styles.description}>{task.description}</p>
            )}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Status</h4>
            <div className={styles.statusButtons}>
              <button
                className={`${styles.statusButton} ${currentStatus === 'backlog' ? styles.statusActive : ''}`}
                onClick={() => handleStatusChange('backlog')}
                disabled={updating}
                tabIndex={0}
              >
                Not Started
              </button>
              <button
                className={`${styles.statusButton} ${currentStatus === 'in_progress' ? styles.statusActive : ''}`}
                onClick={() => handleStatusChange('in_progress')}
                disabled={updating}
                tabIndex={0}
              >
                Started
              </button>
              <button
                className={`${styles.statusButton} ${currentStatus === 'done' ? styles.statusActive : ''}`}
                onClick={() => handleStatusChange('done')}
                disabled={updating}
                tabIndex={0}
              >
                Complete
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Details</h4>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Priority:</span>
                <span 
                  className={styles.priorityBadge}
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>

              {task.group_name && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Group:</span>
                  <span className={styles.detailValue}>{task.group_name}</span>
                </div>
              )}

              {task.estimate_mins && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Estimate:</span>
                  <span className={styles.detailValue}>{task.estimate_mins} minutes</span>
                </div>
              )}

              {task.due_date && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Due Date:</span>
                  <span className={styles.detailValue}>{formatDate(task.due_date)}</span>
                </div>
              )}

              {task.reminder_datetime && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Reminder:</span>
                  <span className={styles.detailValue}>{formatDateTime(task.reminder_datetime)}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Actions</h4>
            <div className={styles.actions}>
              <Link
                to="/home/pomodoro"
                className={styles.pomodoroButton}
                tabIndex={0}
              >
                🍅 Start Pomodoro
              </Link>
              <button
                className={styles.editButton}
                onClick={() => onEdit(task)}
                tabIndex={0}
              >
                Edit Task
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(task.id)}
                tabIndex={0}
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail

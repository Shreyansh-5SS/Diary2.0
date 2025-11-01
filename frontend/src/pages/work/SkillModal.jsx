import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './SkillModal.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function SkillModal({ skill, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetHours, setTargetHours] = useState(0)
  const [learned, setLearned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (skill) {
      setTitle(skill.title)
      setDescription(skill.description || '')
      setTargetHours(skill.target_hours || 0)
      setLearned(skill.learned)
    }
  }, [skill])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        target_hours: parseInt(targetHours) || 0,
        learned
      }

      if (skill) {
        await axios.put(`${API_URL}/api/skills/${skill.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/api/skills`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      onClose()
    } catch (err) {
      console.error('Error saving skill:', err)
      setError(err.response?.data?.error || 'Failed to save skill')
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {skill ? 'Edit Skill' : 'Add Skill'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            tabIndex={0}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="e.g., React, Python, Data Structures"
              required
              tabIndex={0}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="What are you learning about this skill?"
              rows={3}
              tabIndex={0}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="targetHours" className={styles.label}>
              Target Hours
            </label>
            <input
              type="number"
              id="targetHours"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className={styles.input}
              min="0"
              placeholder="0"
              tabIndex={0}
            />
            <span className={styles.hint}>How many hours to master this skill?</span>
          </div>

          <div className={styles.checkboxField}>
            <input
              type="checkbox"
              id="learned"
              checked={learned}
              onChange={(e) => setLearned(e.target.checked)}
              className={styles.checkbox}
              tabIndex={0}
            />
            <label htmlFor="learned" className={styles.checkboxLabel}>
              Mark as learned
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
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
              {loading ? 'Saving...' : (skill ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SkillModal

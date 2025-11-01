import { useState, useEffect } from 'react'
import axios from 'axios'
import Pomodoro from '../../components/Pomodoro'
import styles from './SkillDetail.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function SkillDetail({ skill, onClose, onEdit, onDelete, onUpdate, formatTime }) {
  const [notes, setNotes] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteBody, setNoteBody] = useState('')
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
    fetchAnalytics()
  }, [skill.id])

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/skills/${skill.id}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotes(response.data)
    } catch (err) {
      console.error('Error fetching notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/skills/${skill.id}/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnalytics(response.data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    }
  }

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      alert('Note title is required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const data = {
        title: noteTitle.trim(),
        body: noteBody.trim()
      }

      if (editingNote) {
        await axios.put(
          `${API_URL}/api/skills/${skill.id}/notes/${editingNote.id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          `${API_URL}/api/skills/${skill.id}/notes`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      setShowNoteForm(false)
      setEditingNote(null)
      setNoteTitle('')
      setNoteBody('')
      fetchNotes()
    } catch (err) {
      console.error('Error saving note:', err)
      alert('Failed to save note')
    }
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setNoteTitle(note.title)
    setNoteBody(note.body || '')
    setShowNoteForm(true)
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${API_URL}/api/skills/${skill.id}/notes/${noteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchNotes()
    } catch (err) {
      console.error('Error deleting note:', err)
      alert('Failed to delete note')
    }
  }

  const handleCancelNote = () => {
    setShowNoteForm(false)
    setEditingNote(null)
    setNoteTitle('')
    setNoteBody('')
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getMaxMinutes = () => {
    if (analytics.length === 0) return 1
    return Math.max(...analytics.map(a => a.total_mins))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const maxMinutes = getMaxMinutes()
  const progress = skill.target_hours > 0 
    ? Math.min((skill.total_time_mins / (skill.target_hours * 60)) * 100, 100) 
    : 0

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="detail-title" className={styles.title}>Skill Details</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close skill details"
            tabIndex={0}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Skill Info */}
          <div className={styles.section}>
            <div className={styles.skillHeader}>
              <h3 className={styles.skillTitle}>{skill.title}</h3>
              {skill.learned && <span className={styles.badge}>✓ Learned</span>}
            </div>
            {skill.description && (
              <p className={styles.description}>{skill.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Progress</h4>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Time Spent</div>
                <div className={styles.statValue}>{formatTime(skill.total_time_mins)}</div>
              </div>
              {skill.target_hours > 0 && (
                <>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Target</div>
                    <div className={styles.statValue}>{skill.target_hours}h</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Progress</div>
                    <div className={styles.statValue}>{Math.round(progress)}%</div>
                  </div>
                </>
              )}
            </div>

            {skill.target_hours > 0 && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Analytics Chart */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Last 7 Days</h4>
            {analytics.length > 0 ? (
              <div className={styles.chart}>
                {analytics.map((day) => (
                  <div key={day.date} className={styles.chartBar}>
                    <div
                      className={styles.bar}
                      style={{ height: `${(day.total_mins / maxMinutes) * 100}%` }}
                      title={`${day.total_mins} minutes`}
                    />
                    <span className={styles.barLabel}>{formatDate(day.date)}</span>
                    <span className={styles.barValue}>{day.total_mins}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyChart}>No activity in the last 7 days</p>
            )}
          </div>

          {/* Notes */}
          <div className={styles.section}>
            <div className={styles.notesHeader}>
              <h4 className={styles.sectionTitle}>Notes</h4>
              {!showNoteForm && (
                <button
                  className={styles.addNoteButton}
                  onClick={() => setShowNoteForm(true)}
                  tabIndex={0}
                >
                  + Add Note
                </button>
              )}
            </div>

            {showNoteForm && (
              <div className={styles.noteForm}>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title"
                  className={styles.noteInput}
                  tabIndex={0}
                />
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  placeholder="Note content..."
                  className={styles.noteTextarea}
                  rows={5}
                  tabIndex={0}
                />
                <div className={styles.noteActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelNote}
                    tabIndex={0}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveNote}
                    tabIndex={0}
                  >
                    {editingNote ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <p className={styles.loading}>Loading notes...</p>
            ) : notes.length > 0 ? (
              <div className={styles.notesList}>
                {notes.map((note) => (
                  <div key={note.id} className={styles.noteCard}>
                    <div className={styles.noteHeader}>
                      <h5 className={styles.noteTitle}>{note.title}</h5>
                      <span className={styles.noteDate}>
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {note.body && <p className={styles.noteBody}>{note.body}</p>}
                    <div className={styles.noteActions}>
                      <button
                        className={styles.noteEditButton}
                        onClick={() => handleEditNote(note)}
                        tabIndex={0}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.noteDeleteButton}
                        onClick={() => handleDeleteNote(note.id)}
                        tabIndex={0}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyNotes}>No notes yet. Add your first learning note!</p>
            )}
          </div>

          {/* Actions */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Actions</h4>
            <div className={styles.actions}>
              <button
                className={styles.pomodoroButton}
                onClick={() => setShowPomodoro(true)}
                tabIndex={0}
              >
                🍅 Start Pomodoro
              </button>
              <button
                className={styles.editButton}
                onClick={() => onEdit(skill)}
                tabIndex={0}
              >
                Edit Skill
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete(skill.id)}
                tabIndex={0}
              >
                Delete Skill
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPomodoro && (
        <div className={styles.pomodoroOverlay}>
          <Pomodoro
            selectedSkill={skill}
            onClose={() => {
              setShowPomodoro(false)
              onUpdate()
              fetchAnalytics()
            }}
          />
        </div>
      )}
    </div>
  )
}

export default SkillDetail

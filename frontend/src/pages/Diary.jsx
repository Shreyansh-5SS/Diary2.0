import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DiaryModal from '../components/DiaryModal'
import axios from 'axios'
import styles from '../styles/Diary.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Diary() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
    } else if (isAuthenticated) {
      fetchEntries()
    }
  }, [isAuthenticated, authLoading, navigate])

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/diary`)
      setEntries(response.data.entries)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingEntry(null)
    setShowModal(true)
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setShowModal(true)
  }

  const handleSave = async () => {
    setShowModal(false)
    setEditingEntry(null)
    await fetchEntries()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/api/diary/${id}`)
      await fetchEntries()
    } catch (error) {
      console.error('Failed to delete entry:', error)
      alert('Failed to delete entry')
    }
  }

  const toggleStar = async (entry) => {
    try {
      await axios.put(`${API_URL}/api/diary/${entry.id}`, {
        starred: !entry.starred
      })
      await fetchEntries()
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getExcerpt = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading diary...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Diary</h1>
        <button onClick={handleCreate} className={styles.createButton}>
          + New Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No diary entries yet.</p>
          <p className={styles.emptyHint}>
            Click "New Entry" to start writing your first entry
          </p>
        </div>
      ) : (
        <div className={styles.entriesList}>
          {entries.map((entry) => (
            <article key={entry.id} className={styles.entryCard}>
              <div className={styles.cardHeader}>
                <time className={styles.date}>{formatDate(entry.entry_date)}</time>
                <button
                  onClick={() => toggleStar(entry)}
                  className={`${styles.starButton} ${entry.starred ? styles.starred : ''}`}
                  aria-label={entry.starred ? 'Unstar entry' : 'Star entry'}
                  title={entry.starred ? 'Unstar' : 'Star'}
                >
                  {entry.starred ? '★' : '☆'}
                </button>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.textContent}>
                  {entry.title && <h2 className={styles.entryTitle}>{entry.title}</h2>}
                  <p className={styles.excerpt}>{getExcerpt(entry.content)}</p>
                  {entry.mood && <span className={styles.mood}>{entry.mood}</span>}
                </div>

                {entry.image_url && (
                  <div className={styles.thumbnail}>
                    <img
                      src={`${API_URL}${entry.image_url}`}
                      alt={entry.title || 'Diary entry'}
                      className={styles.thumbnailImage}
                    />
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <button
                  onClick={() => navigate(`/home/diary/${entry.id}`)}
                  className={styles.actionButton}
                >
                  Read
                </button>
                <button
                  onClick={() => handleEdit(entry)}
                  className={styles.actionButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <DiaryModal
          entry={editingEntry}
          onClose={() => {
            setShowModal(false)
            setEditingEntry(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

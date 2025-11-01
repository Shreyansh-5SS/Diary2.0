import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import styles from '../styles/DiaryDetail.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function DiaryDetail() {
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading: authLoading } = useAuth()

  // Function definitions BEFORE useEffect and early returns
  const fetchEntry = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/diary/${id}`)
      setEntry(response.data.entry)
    } catch (error) {
      console.error('Failed to fetch entry:', error)
      alert('Failed to load diary entry')
      navigate('/home/diary')
    } finally {
      setLoading(false)
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } })
    } else if (isAuthenticated) {
      fetchEntry()
    }
  }, [id, isAuthenticated, authLoading, navigate, location])

  if (authLoading || loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  if (!entry) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Entry not found</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/home/diary')} className={styles.backButton}>
        ← Back to Diary
      </button>

      <article className={styles.entryPage}>
        <header className={styles.header}>
          <time className={styles.date}>{formatDate(entry.entry_date)}</time>
          {entry.starred && <span className={styles.starBadge}>★ Starred</span>}
        </header>

        {entry.title && <h1 className={styles.title}>{entry.title}</h1>}

        {entry.mood && (
          <div className={styles.moodSection}>
            <span className={styles.moodLabel}>Mood:</span>
            <span className={styles.mood}>{entry.mood}</span>
          </div>
        )}

        {entry.image_url && (
          <figure className={styles.imageContainer}>
            <img
              src={`${API_URL}${entry.image_url}`}
              alt={entry.title || 'Diary entry'}
              className={styles.image}
            />
          </figure>
        )}

        <div className={styles.content}>
          {entry.content.split('\n').map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {entry.tags && JSON.parse(entry.tags).length > 0 && (
          <div className={styles.tagsSection}>
            <span className={styles.tagsLabel}>Tags:</span>
            <div className={styles.tags}>
              {JSON.parse(entry.tags).map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          <time className={styles.timestamp}>
            Created: {new Date(entry.created_at).toLocaleString()}
          </time>
          {entry.updated_at !== entry.created_at && (
            <time className={styles.timestamp}>
              Updated: {new Date(entry.updated_at).toLocaleString()}
            </time>
          )}
        </footer>
      </article>
    </div>
  )
}

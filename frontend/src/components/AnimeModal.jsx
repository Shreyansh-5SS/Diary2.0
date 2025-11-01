import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/AnimeModal.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
]

const STATUS_OPTIONS = [
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'plan_to_watch', label: 'Plan to Watch' },
  { value: 'dropped', label: 'Dropped' }
]

export default function AnimeModal({ anime, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    genres: [],
    rating: null,
    status: 'plan_to_watch',
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (anime) {
      setFormData({
        title: anime.title || '',
        image_url: anime.image_url || '',
        genres: anime.genres || [],
        rating: anime.rating || null,
        status: anime.status || 'plan_to_watch',
        notes: anime.notes || ''
      })
    }
  }, [anime])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleGenre = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const setRating = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: prev.rating === rating ? null : rating
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    setSaving(true)

    try {
      if (anime) {
        // Update existing anime
        await axios.put(`${API_URL}/api/anime/${anime.id}`, formData)
      } else {
        // Create new anime
        await axios.post(`${API_URL}/api/anime`, formData)
      }

      onSave()
    } catch (error) {
      console.error('Save failed:', error)
      setError(error.response?.data?.message || 'Failed to save anime')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{anime ? 'Edit Anime' : 'Add Anime'}</h2>
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
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Anime title"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="image_url" className={styles.label}>
              Cover Image URL
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className={styles.imagePreview}>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className={styles.previewImage}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Genres</label>
            <div className={styles.genreGrid}>
              {GENRES.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`${styles.genreOption} ${
                    formData.genres.includes(genre) ? styles.genreSelected : ''
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Rating (1-5)</label>
            <div className={styles.ratingSelector}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setRating(rating)}
                  className={`${styles.ratingSquare} ${
                    formData.rating >= rating ? styles.ratingSelected : ''
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            {formData.rating && (
              <button
                type="button"
                onClick={() => setRating(null)}
                className={styles.clearRating}
              >
                Clear Rating
              </button>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="notes" className={styles.label}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={styles.textarea}
              rows={4}
              placeholder="Your thoughts on this anime..."
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
              {saving ? 'Saving...' : 'Save Anime'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

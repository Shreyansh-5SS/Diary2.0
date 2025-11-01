import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/DiaryModal.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function DiaryModal({ entry, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    entry_date: new Date().toISOString().split('T')[0],
    mood: '',
    starred: false,
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || '',
        content: entry.content || '',
        entry_date: entry.entry_date || '',
        mood: entry.mood || '',
        starred: entry.starred || false,
        image_url: entry.image_url || ''
      })
      if (entry.image_url) {
        setImagePreview(`${API_URL}${entry.image_url}`)
      }
    }
  }, [entry])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    setImageFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const handleUploadImage = async () => {
    if (!imageFile) return null

    setUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append('image', imageFile)

      const response = await axios.post(`${API_URL}/api/uploads/local`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data.url
    } catch (error) {
      console.error('Upload failed:', error)
      setError('Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.content.trim()) {
      setError('Content is required')
      return
    }

    if (!formData.entry_date) {
      setError('Date is required')
      return
    }

    setSaving(true)

    try {
      // Upload image if new file selected
      let imageUrl = formData.image_url
      if (imageFile) {
        const uploadedUrl = await handleUploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const dataToSave = {
        ...formData,
        image_url: imageUrl
      }

      if (entry) {
        // Update existing entry
        await axios.put(`${API_URL}/api/diary/${entry.id}`, dataToSave)
      } else {
        // Create new entry
        await axios.post(`${API_URL}/api/diary`, dataToSave)
      }

      onSave()
    } catch (error) {
      console.error('Save failed:', error)
      setError(error.response?.data?.message || 'Failed to save entry')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{entry ? 'Edit Entry' : 'New Entry'}</h2>
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
            <label htmlFor="entry_date" className={styles.label}>
              Date *
            </label>
            <input
              id="entry_date"
              name="entry_date"
              type="date"
              value={formData.entry_date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Optional title for your entry"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content" className={styles.label}>
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={styles.textarea}
              rows={10}
              placeholder="Write your diary entry here..."
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mood" className={styles.label}>
              Mood
            </label>
            <input
              id="mood"
              name="mood"
              type="text"
              value={formData.mood}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., happy, contemplative, excited"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="image" className={styles.label}>
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className={styles.fileInput}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={styles.removeImageButton}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className={styles.checkboxField}>
            <input
              id="starred"
              name="starred"
              type="checkbox"
              checked={formData.starred}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label htmlFor="starred" className={styles.checkboxLabel}>
              ★ Star this entry
            </label>
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
              disabled={saving || uploading}
            >
              {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Timetable.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function Timetable() {
  const navigate = useNavigate()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const printRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:00',
    description: '',
    is_free_time: false,
    task_id: null
  })

  useEffect(() => {
    fetchTimetable()
  }, [])

  const fetchTimetable = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/timetable`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSlots(response.data)
    } catch (err) {
      console.error('Error fetching timetable:', err)
      alert('Failed to load timetable')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggest = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/timetable/suggest`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data.suggestions.length === 0) {
        alert(response.data.message || 'No suggestions available')
        return
      }

      setSuggestions(response.data.suggestions)
      setShowSuggestions(true)
    } catch (err) {
      console.error('Error getting suggestions:', err)
      alert('Failed to generate suggestions')
    }
  }

  const handleAcceptSuggestion = async (suggestion) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${API_URL}/api/timetable`,
        {
          ...suggestion,
          is_free_time: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => 
        s.task_id !== suggestion.task_id || 
        s.day_of_week !== suggestion.day_of_week ||
        s.start_time !== suggestion.start_time
      ))
      
      fetchTimetable()
    } catch (err) {
      console.error('Error accepting suggestion:', err)
      alert('Failed to add slot')
    }
  }

  const handleAcceptAll = async () => {
    try {
      const token = localStorage.getItem('token')
      for (const suggestion of suggestions) {
        await axios.post(
          `${API_URL}/api/timetable`,
          {
            ...suggestion,
            is_free_time: false
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      setSuggestions([])
      setShowSuggestions(false)
      fetchTimetable()
      alert('All suggestions added!')
    } catch (err) {
      console.error('Error accepting all:', err)
      alert('Failed to add some slots')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.start_time || !formData.end_time) {
      alert('Start time and end time are required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      if (editingSlot) {
        await axios.put(
          `${API_URL}/api/timetable/${editingSlot.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          `${API_URL}/api/timetable`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      setShowAddForm(false)
      setEditingSlot(null)
      resetForm()
      fetchTimetable()
    } catch (err) {
      console.error('Error saving slot:', err)
      alert(err.response?.data?.error || 'Failed to save slot')
    }
  }

  const handleEdit = (slot) => {
    setEditingSlot(slot)
    setFormData({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time.substring(0, 5),
      end_time: slot.end_time.substring(0, 5),
      description: slot.description || '',
      is_free_time: slot.is_free_time,
      task_id: slot.task_id
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/timetable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTimetable()
    } catch (err) {
      console.error('Error deleting slot:', err)
      alert('Failed to delete slot')
    }
  }

  const resetForm = () => {
    setFormData({
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      description: '',
      is_free_time: false,
      task_id: null
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const getSlotStyle = (slot) => {
    if (slot.is_free_time) {
      return { backgroundColor: '#d1fae5', borderColor: '#10b981' }
    }
    if (slot.task_id) {
      const priorityColors = {
        urgent: '#fecaca',
        high: '#fed7aa',
        medium: '#fde68a',
        low: '#d1fae5'
      }
      return { 
        backgroundColor: priorityColors[slot.task_priority] || '#e5e7eb',
        borderColor: '#374151'
      }
    }
    return { backgroundColor: '#f3f4f6', borderColor: '#6b7280' }
  }

  const groupSlotsByDay = () => {
    const grouped = {}
    DAYS.forEach((_, idx) => {
      grouped[idx] = slots.filter(s => s.day_of_week === idx)
    })
    return grouped
  }

  if (loading) {
    return (
      <div className={styles.timetable}>
        <div className={styles.loading}>Loading timetable...</div>
      </div>
    )
  }

  const slotsByDay = groupSlotsByDay()

  return (
    <div className={styles.timetable}>
      <div className={styles.header}>
        <h1 className={styles.title}>Timetable</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/work/desk')}
            aria-label="Back to WorkDesk"
            tabIndex={0}
          >
            ← WorkDesk
          </button>
          <button
            className={styles.suggestButton}
            onClick={handleSuggest}
            aria-label="Get suggestions"
            tabIndex={0}
          >
            💡 Suggest
          </button>
          <button
            className={styles.printButton}
            onClick={handlePrint}
            aria-label="Print timetable"
            tabIndex={0}
          >
            🖨️ Print
          </button>
          <button
            className={styles.addButton}
            onClick={() => {
              setEditingSlot(null)
              resetForm()
              setShowAddForm(true)
            }}
            aria-label="Add slot"
            tabIndex={0}
          >
            + Add Slot
          </button>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className={styles.grid} ref={printRef}>
        {DAYS.map((day, dayIdx) => (
          <div key={dayIdx} className={styles.dayColumn}>
            <div className={styles.dayHeader}>{day}</div>
            <div className={styles.daySlots}>
              {slotsByDay[dayIdx].length > 0 ? (
                slotsByDay[dayIdx].map((slot) => (
                  <div
                    key={slot.id}
                    className={styles.slot}
                    style={getSlotStyle(slot)}
                    onClick={() => handleEdit(slot)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleEdit(slot)
                      }
                    }}
                    aria-label={`Slot: ${slot.description || 'No description'}`}
                  >
                    <div className={styles.slotTime}>
                      {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                    </div>
                    {slot.is_free_time && (
                      <div className={styles.slotBadge}>FREE TIME</div>
                    )}
                    {slot.task_title && (
                      <div className={styles.slotTask}>{slot.task_title}</div>
                    )}
                    {slot.description && (
                      <div className={styles.slotDescription}>{slot.description}</div>
                    )}
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(slot.id)
                      }}
                      aria-label="Delete slot"
                      tabIndex={0}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyDay}>No slots</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingSlot ? 'Edit Slot' : 'Add Slot'}
              </h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowAddForm(false)
                  setEditingSlot(null)
                  resetForm()
                }}
                aria-label="Close"
                tabIndex={0}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Day</label>
                <select
                  className={styles.select}
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                  tabIndex={0}
                >
                  {DAYS.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Time</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                    tabIndex={0}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>End Time</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                    tabIndex={0}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Study session, Gym, Meeting..."
                  tabIndex={0}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.is_free_time}
                    onChange={(e) => setFormData({ ...formData, is_free_time: e.target.checked })}
                    tabIndex={0}
                  />
                  <span>Mark as free time (available for suggestions)</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingSlot(null)
                    resetForm()
                  }}
                  tabIndex={0}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  tabIndex={0}
                >
                  {editingSlot ? 'Update' : 'Add'} Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggestions Modal */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Suggested Schedule</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowSuggestions(false)}
                aria-label="Close"
                tabIndex={0}
              >
                ✕
              </button>
            </div>

            <div className={styles.suggestions}>
              <p className={styles.suggestionsInfo}>
                Found {suggestions.length} suggestions for your tasks
              </p>

              <div className={styles.suggestionsList}>
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className={styles.suggestionItem}>
                    <div className={styles.suggestionHeader}>
                      <strong>{suggestion.task_title}</strong>
                      <span className={styles.suggestionPriority}>
                        {suggestion.task_priority}
                      </span>
                    </div>
                    <div className={styles.suggestionDetails}>
                      {DAYS[suggestion.day_of_week]} • {suggestion.start_time.substring(0, 5)} - {suggestion.end_time.substring(0, 5)}
                      {' '}({suggestion.duration_mins} mins)
                    </div>
                    <button
                      className={styles.acceptButton}
                      onClick={() => handleAcceptSuggestion(suggestion)}
                      tabIndex={0}
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.formActions}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowSuggestions(false)}
                  tabIndex={0}
                >
                  Cancel
                </button>
                <button
                  className={styles.submitButton}
                  onClick={handleAcceptAll}
                  tabIndex={0}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timetable

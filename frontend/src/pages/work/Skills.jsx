import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SkillCard from './SkillCard'
import SkillModal from './SkillModal'
import SkillDetail from './SkillDetail'
import styles from './Skills.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function Skills() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSkills(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching skills:', err)
      setError('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSkill = () => {
    setEditingSkill(null)
    setShowSkillModal(true)
  }

  const handleEditSkill = (skill) => {
    setEditingSkill(skill)
    setShowSkillModal(true)
    setSelectedSkill(null)
  }

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill? This will also delete all associated notes.')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSkills()
    } catch (err) {
      console.error('Error deleting skill:', err)
      alert('Failed to delete skill')
    }
  }

  const handleModalClose = () => {
    setShowSkillModal(false)
    setEditingSkill(null)
    fetchSkills()
  }

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill)
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className={styles.skills}>
        <div className={styles.loading}>Loading skills...</div>
      </div>
    )
  }

  return (
    <div className={styles.skills}>
      <div className={styles.header}>
        <h1 className={styles.title}>Skills</h1>
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
            className={styles.addButton}
            onClick={handleCreateSkill}
            aria-label="Add new skill"
            tabIndex={0}
          >
            + Add Skill
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {skills.length === 0 ? (
        <div className={styles.empty}>
          <p>No skills yet. Start tracking your learning journey!</p>
          <button
            className={styles.emptyButton}
            onClick={handleCreateSkill}
            tabIndex={0}
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={() => handleSkillClick(skill)}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}

      {showSkillModal && (
        <SkillModal
          skill={editingSkill}
          onClose={handleModalClose}
        />
      )}

      {selectedSkill && (
        <SkillDetail
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill}
          onUpdate={fetchSkills}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}

export default Skills

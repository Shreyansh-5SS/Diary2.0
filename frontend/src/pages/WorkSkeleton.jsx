import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './WorkSkeleton.module.css'

function WorkSkeleton() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: location } })
    }
  }, [isAuthenticated, loading, navigate, location])

  if (loading) {
    return <div className={styles.pageContainer}>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1 className={styles.pageHeading}>
          WORK
        </h1>
        <p className={styles.pageDescription}>
          Your professional portfolio hub. Projects, skills, timetable, and tasks 
          will be available here soon.
        </p>
        <p className={styles.pageDescription}>
          Everything you need to present your work with clarity and impact. 
          Sharp corners, flat design, pure focus on what matters—your craft.
        </p>
        <Link 
          to="/" 
          className={styles.backButton}
          aria-label="Return to landing page"
        >
          ← Back to Landing
        </Link>
      </div>
    </div>
  )
}

export default WorkSkeleton

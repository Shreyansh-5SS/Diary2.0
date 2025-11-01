import { Link } from 'react-router-dom'
import styles from './WorkSkeleton.module.css'

function WorkSkeleton() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1 className={styles.pageHeading}>
          WORK
        </h1>
        <p className={styles.pageDescription}>
          Your professional portfolio hub. Showcase your projects with bold, 
          high-contrast cards. Track your skills, manage your timetable, and 
          organize tasks on your WorkDesk.
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

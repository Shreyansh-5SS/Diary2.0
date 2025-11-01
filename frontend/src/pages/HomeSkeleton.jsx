import { Link } from 'react-router-dom'
import styles from './HomeSkeleton.module.css'

function HomeSkeleton() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1 className={styles.pageHeading}>
          HOME
        </h1>
        <p className={styles.pageDescription}>
          Welcome to your personal space. Here you'll find your diary entries, 
          anime collection organized in a beautiful masonry grid, and your 
          wallet tracker with visual progress indicators.
        </p>
        <p className={styles.pageDescription}>
          This is where life happens—thoughts, passions, and finances in one 
          minimalist, brutalist interface. No distractions, just content.
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

export default HomeSkeleton

import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './HomeSkeleton.module.css'

function HomeSkeleton() {
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
          HOME
        </h1>
        <p className={styles.pageDescription}>
          Welcome to your personal space. Access your diary entries, 
          anime collection organized in a beautiful masonry grid, and your 
          wallet tracker with visual progress indicators.
        </p>
        
        <nav className={styles.navigation}>
          <Link 
            to="/home/diary" 
            className={styles.navButton}
            aria-label="Go to Diary"
          >
            <span className={styles.navIcon}>📔</span>
            <span className={styles.navLabel}>Diary</span>
            <span className={styles.navDescription}>Personal entries & thoughts</span>
          </Link>
          
          <Link 
            to="/home/anime" 
            className={styles.navButton}
            aria-label="Go to Anime Watchlist"
          >
            <span className={styles.navIcon}>🎬</span>
            <span className={styles.navLabel}>Anime</span>
            <span className={styles.navDescription}>Watchlist & ratings</span>
          </Link>
          
          <Link 
            to="/home/expenses" 
            className={styles.navButton}
            aria-label="Go to Wallet & Expenses"
          >
            <span className={styles.navIcon}>💰</span>
            <span className={styles.navLabel}>Wallet</span>
            <span className={styles.navDescription}>Expenses & savings</span>
          </Link>
        </nav>

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

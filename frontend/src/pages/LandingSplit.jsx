import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LandingSplit.module.css'

function LandingSplit() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      // Store intended destination and go to login
      navigate('/login', { state: { from: { pathname: path } } })
    } else {
      navigate(path)
    }
  }

  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigation(path)
    }
  }

  return (
    <div className={styles.splitContainer}>
      <div 
        className={`${styles.half} ${styles.leftHalf}`}
        onClick={() => handleNavigation('/home')}
        onKeyDown={(e) => handleKeyDown(e, '/home')}
        role="button"
        tabIndex="0"
        aria-label="Navigate to HOME section - Personal, Anime, and Wallet"
      >
        <h1 className={`${styles.heading} hover-translate`}>
          HOME
        </h1>
        <p className={`${styles.subtext} subtext`}>
          Personal • Anime • Wallet
        </p>
      </div>

      <div 
        className={`${styles.half} ${styles.rightHalf}`}
        onClick={() => handleNavigation('/work')}
        onKeyDown={(e) => handleKeyDown(e, '/work')}
        role="button"
        tabIndex="0"
        aria-label="Navigate to WORK section - Portfolio, Desk, and Skills"
      >
        <h1 className={`${styles.heading} hover-translate`}>
          WORK
        </h1>
        <p className={`${styles.subtext} subtext`}>
          Portfolio • Desk • Skills
        </p>
      </div>

      <div className={styles.divider}>
        <div className={styles.centerLabel}>
          SHREYANSH PERSONAL DIARY
        </div>
      </div>
    </div>
  )
}

export default LandingSplit

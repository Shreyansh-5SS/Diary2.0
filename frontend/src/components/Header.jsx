import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        // Always show at top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setIsVisible(false)
      } else {
        // Scrolling up - show
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleMenu()
    }
  }

  return (
    <>
      <header 
        className={`${styles.header} ${!isVisible ? styles.headerHidden : ''}`} 
        role="banner"
      >
        <div className={styles.container}>
          <Link 
            to="/" 
            className={styles.logo}
            aria-label="Go to homepage"
          >
            Shreyansh
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link 
              to="/home" 
              className={styles.navLink}
              aria-label="Go to HOME section"
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className={styles.navLabel}>HOME</span>
            </Link>
            <Link 
              to="/work" 
              className={styles.navLink}
              aria-label="Go to WORK section"
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span className={styles.navLabel}>WORK</span>
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button 
            className={styles.hamburger}
            onClick={toggleMenu}
            onKeyDown={handleKeyDown}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            tabIndex="0"
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen1 : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen2 : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen3 : ''}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Side Panel */}
      <div 
        className={`${styles.overlay} ${isMenuOpen ? styles.overlayOpen : ''}`}
        onClick={toggleMenu}
        aria-hidden={!isMenuOpen}
      />
      <nav 
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileMenuHeader}>
          <span className={styles.mobileMenuTitle}>Navigation</span>
          <button 
            className={styles.closeButton}
            onClick={toggleMenu}
            aria-label="Close menu"
            tabIndex={isMenuOpen ? 0 : -1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <ul className={styles.mobileMenuList}>
          <li>
            <Link 
              to="/" 
              className={styles.mobileMenuLink}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <svg className={styles.mobileMenuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Landing
            </Link>
          </li>
          <li>
            <Link 
              to="/home" 
              className={styles.mobileMenuLink}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <svg className={styles.mobileMenuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              HOME
            </Link>
          </li>
          <li>
            <Link 
              to="/work" 
              className={styles.mobileMenuLink}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <svg className={styles.mobileMenuIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              WORK
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Header

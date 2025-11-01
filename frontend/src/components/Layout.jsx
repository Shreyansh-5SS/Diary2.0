import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import styles from './Layout.module.css'

function Layout({ children }) {
  const location = useLocation()

  // Toggle theme class on body based on route
  useEffect(() => {
    const body = document.body
    
    // Remove all theme classes
    body.classList.remove('theme-home', 'theme-work', 'theme-landing')
    
    // Add appropriate theme class based on route
    if (location.pathname.startsWith('/home')) {
      body.classList.add('theme-home')
    } else if (location.pathname.startsWith('/work')) {
      body.classList.add('theme-work')
    } else if (location.pathname === '/') {
      body.classList.add('theme-landing')
    }

    // Cleanup on unmount
    return () => {
      body.classList.remove('theme-home', 'theme-work', 'theme-landing')
    }
  }, [location])

  // Don't show header on landing page
  const showHeader = location.pathname !== '/'

  return (
    <div className={styles.layoutWrapper}>
      {showHeader && <Header />}
      <main className={showHeader ? styles.mainWithHeader : styles.main}>
        {children}
      </main>
    </div>
  )
}

export default Layout

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import LandingSplit from './pages/LandingSplit'
import HomeSkeleton from './pages/HomeSkeleton'
import WorkSkeleton from './pages/WorkSkeleton'
import Login from './pages/Login'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingSplit />} />
            <Route path="/home" element={<HomeSkeleton />} />
            <Route path="/work" element={<WorkSkeleton />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App

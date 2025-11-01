import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import LandingSplit from './pages/LandingSplit'
import HomeSkeleton from './pages/HomeSkeleton'
import WorkSkeleton from './pages/WorkSkeleton'
import Login from './pages/Login'
import Diary from './pages/Diary'
import DiaryDetail from './pages/DiaryDetail'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingSplit />} />
            <Route path="/home" element={<HomeSkeleton />} />
            <Route path="/home/diary" element={<Diary />} />
            <Route path="/home/diary/:id" element={<DiaryDetail />} />
            <Route path="/work" element={<WorkSkeleton />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App

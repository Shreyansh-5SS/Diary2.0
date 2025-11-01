import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import LandingSplit from './pages/LandingSplit'
import HomeSkeleton from './pages/HomeSkeleton'
import WorkSkeleton from './pages/WorkSkeleton'
import Login from './pages/Login'
import Diary from './pages/Diary'
import DiaryDetail from './pages/DiaryDetail'
import Anime from './pages/Anime'
import Expenses from './pages/Expenses'

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
            <Route path="/home/anime" element={<Anime />} />
            <Route path="/home/expenses" element={<Expenses />} />
            <Route path="/work" element={<WorkSkeleton />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App

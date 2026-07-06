import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import Dispatches from './pages/Dispatches'
import Clients from './pages/Clients'
import Drivers from './pages/Drivers'
import Settlements from './pages/Settlements'

const Dashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold">대시보드</h2>
    <p className="mt-2 text-secondary">환영합니다! 오늘 등록된 배차 건수와 정산 현황을 한눈에 확인하세요.</p>
  </div>
)

function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    // One-time migration to seed new perfect database
    if (!localStorage.getItem('perfect_db_v1')) {
      localStorage.removeItem('clients')
      localStorage.removeItem('drivers')
      localStorage.removeItem('dispatches')
      localStorage.setItem('perfect_db_v1', 'true')
    }
  }, [])

  useEffect(() => {
    // Initialize theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dispatches" element={<Dispatches />} />
          <Route path="clients" element={<Clients />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="settlements" element={<Settlements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

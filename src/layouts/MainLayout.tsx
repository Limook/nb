import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Truck, Users, UserSquare2, Calculator, Moon, Sun, Menu } from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'
import { useState } from 'react'

const MainLayout = () => {
  const { theme, toggleTheme } = useThemeStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { name: '대시보드', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: '배차 관리', path: '/dispatches', icon: <Truck size={20} /> },
    { name: '거래처 관리', path: '/clients', icon: <Users size={20} /> },
    { name: '차주 관리', path: '/drivers', icon: <UserSquare2 size={20} /> },
    { name: '정산 관리', path: '/settlements', icon: <Calculator size={20} /> },
  ]

  return (
    <div className="app-container">
      {/* Invisible Edge Sensor for Sidebar Auto-open */}
      <div 
        onMouseEnter={() => setIsSidebarOpen(true)}
        onClick={() => setIsSidebarOpen(true)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '16px',
          zIndex: 90,
          cursor: 'pointer',
          backgroundColor: 'transparent'
        }}
      />

      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside 
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`main-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '260px',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-260px)',
          transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 100,
          boxShadow: isSidebarOpen ? '4px 0 24px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            backgroundColor: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(49, 130, 246, 0.3)'
          }}>
            <Truck style={{ color: '#ffffff' }} size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-lg font-bold" style={{ whiteSpace: 'nowrap', lineHeight: '1.2' }}>T-Logis</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>PARTNERS TMS</span>
          </div>
        </div>
        
        <nav style={{ padding: '1rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)'
              })}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Theme Toggle */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-tertiary)' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #1b64da 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            A
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p className="text-sm font-bold" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>최한별 대표</p>
            <p className="text-sm text-tertiary" style={{ fontSize: '0.75rem', fontWeight: 500 }}>최고관리자</p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-primary)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
            title="다크모드 토글"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content" style={{ width: '100%' }}>
        {/* Mobile Header (visible only on mobile <= 768px) */}
        <header 
          className="mobile-header"
          style={{
            height: '56px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            position: 'sticky',
            top: 0,
            zIndex: 80,
            flexShrink: 0
          }}
        >
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{ 
              background: 'var(--bg-primary)', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              padding: '0.5rem', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>T-Logis</span>
          <div style={{ width: '36px' }} />
        </header>

        {/* Page Content */}
        <main className="page-content" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

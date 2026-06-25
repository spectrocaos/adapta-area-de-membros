import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { usePreferences } from '../../hooks/usePreferences'
import '../../styles/global.css'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile off-canvas
  const [isCollapsed, setIsCollapsed] = useState(false) // Desktop collapse
  usePreferences() // Garante que as preferências são aplicadas globalmente na inicialização

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <div className={`app-layout ${isCollapsed ? 'collapsed' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Decoration */}
      <div className="bg-decoration-container">
        <div className="bg-decoration-blob-1 animate-pulse-glow"></div>
        <div className="bg-decoration-blob-2 animate-pulse-glow"></div>
      </div>

      <div 
        className={`app-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`app-sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      </aside>
      
      <div className="app-main z-10 relative animate-fade-scale">
        <header className="app-topbar glass-card" style={{ margin: 'var(--space-6) var(--space-8)', borderRadius: 'var(--radius-full)' }}>
          <Topbar toggleSidebar={toggleSidebar} />
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

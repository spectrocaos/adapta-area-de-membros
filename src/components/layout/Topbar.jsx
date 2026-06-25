import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, Sun, Moon, ZapOff, Menu } from 'lucide-react'
import { useState } from 'react'
import './Topbar.css'

export default function Topbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [lowStimulation, setLowStimulation] = useState(
    document.documentElement.dataset.lowStimulation === 'true'
  )

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function toggleLowStimulation() {
    const next = !lowStimulation
    setLowStimulation(next)
    document.documentElement.dataset.lowStimulation = String(next)
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button 
          className="topbar-mobile-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Abrir Menu"
        >
          <Menu size={24} />
        </button>
        {/* Breadcrumb ou título da página pode ser inserido aqui via contexto */}
      </div>
      <div className="topbar-right">
        {/* Modo Baixa Estimulação */}
        <button
          className={`topbar-icon-btn${lowStimulation ? ' active' : ''}`}
          onClick={toggleLowStimulation}
          title="Modo de baixa estimulação"
          aria-pressed={lowStimulation}
        >
          <ZapOff size={18} />
        </button>

        {/* Perfil */}
        <div className="topbar-user">
          <span className="topbar-user-name">{user?.name}</span>
          <span className="topbar-user-role">
            {user?.profile === 'teacher' ? 'Professor' : 'Aluno'}
          </span>
        </div>

        {/* Logout */}
        <button
          className="topbar-icon-btn danger"
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair da conta"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  )
}

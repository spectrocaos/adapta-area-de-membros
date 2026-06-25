import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard,
  BookOpen,
  Wand2,
  Library,
  Users,
  Settings,
  FolderOpen,
  Brain,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  BookMarked
} from 'lucide-react'
import './Sidebar.css'

const teacherNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Área de Trabalho' },
  { to: '/conversor', icon: Wand2,           label: 'Estúdio de materiais' },
  { to: '/meus-cursos',icon: BookMarked,     label: 'Meus Cursos' },
  { to: '/biblioteca',icon: Library,         label: 'Biblioteca de materiais' },
  { to: '/perfis',    icon: Bookmark,        label: 'Perfis salvos' },
  { to: '/turmas',    icon: Users,           label: 'Turmas criadas' },
  { to: '/cursos',    icon: BookOpen,        label: 'Cursos de apoio' },
  { to: '/perfil',    icon: Settings,        label: 'Configurações' },
]

const studentNav = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Área de Estudo' },
  { to: '/meus-cursos',      icon: BookMarked,      label: 'Meus Cursos' },
  { to: '/cursos',           icon: BookOpen,        label: 'Cursos de apoio' },
  { to: '/materiais',        icon: FolderOpen,      label: 'Materiais' },
  { to: '/meus-professores', icon: GraduationCap,   label: 'Meus Professores' },
  { to: '/minhas-materias',  icon: BookMarked,      label: 'Minhas Matérias' },
  { to: '/perfil',           icon: Settings,        label: 'Configurações' },
]

const conditionColors = {
  tea:         'var(--color-tea)',
  dyslexia:    'var(--color-dyslexia)',
  adhd:        'var(--color-adhd)',
  color_blind: 'var(--color-color-blind)',
}

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const { user } = useAuth()
  const nav = user?.profile === 'teacher' ? teacherNav : studentNav
  const conditionColor = conditionColors[user?.condition] || 'var(--color-primary)'

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/icone.webp" alt="Adapta Ícone" className="custom-logo-icon" />
        {!isCollapsed && <img src="/nome.webp" alt="Adapta" className="custom-logo-text" />}
      </div>

      {/* Perfil badge */}
      <div className="sidebar-profile">
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt="Foto de perfil"
            className="sidebar-avatar"
            style={{ objectFit: 'cover', padding: 0 }}
          />
        ) : (
          <div className="sidebar-avatar" style={{ background: conditionColor }}>
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        )}
        {!isCollapsed && (
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{user?.name ?? 'Usuário'}</span>
            <span className="sidebar-profile-role">
              {user?.profile === 'teacher' ? 'Professor' : 'Aluno'}
            </span>
          </div>
        )}
      </div>

      {/* Navegação */}
      <ul className="sidebar-nav">
        {nav.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              title={isCollapsed ? label : ''}
            >
              <Icon size={18} />
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Rodapé e botão de toggle */}
      <div className="sidebar-footer">
        {!isCollapsed && <span className="sidebar-version">v1.0.0 — MVP</span>}
        <button 
          className="sidebar-toggle-btn" 
          onClick={toggleCollapse}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </nav>
  )
}

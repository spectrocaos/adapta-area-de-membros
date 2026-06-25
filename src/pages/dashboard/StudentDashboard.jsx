import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCourseProgress } from '../../hooks/useCourseProgress'
import { TRAILS, COURSES } from '../../data/courses'
import { BookOpen, FolderOpen, ChevronRight, Brain, Zap, Eye, Heart } from 'lucide-react'
import './StudentDashboard.css'

const TRAIL_ICONS = { tea: Brain, dyslexia: BookOpen, adhd: Zap, color_blind: Eye, inclusion: Heart }

const CONDITION_LABELS = {
  tea:         { label: 'TEA', trailId: 'tea' },
  dyslexia:    { label: 'Dislexia', trailId: 'dyslexia' },
  adhd:        { label: 'TDAH', trailId: 'adhd' },
  color_blind: { label: 'Daltonismo', trailId: 'color_blind' },
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { getTrailProgress, getCourseProgress } = useCourseProgress()

  const condition = CONDITION_LABELS[user?.condition]
  const trail = condition ? TRAILS.find(t => t.id === condition.trailId) : null

  const inProgressCourses = COURSES
    .filter(c => {
      const { done, percent } = getCourseProgress(c.id)
      return done > 0 && percent < 100
    })
    .slice(0, 3)

  return (
    <div className="student-dashboard animate-fade-in">
      {/* Welcome */}
      <div
        className="student-welcome"
        style={trail ? {
          background: `linear-gradient(135deg, ${trail.colorLight} 0%, white 100%)`,
          borderColor: trail.color
        } : {}}
      >
        <div className="student-welcome-content">
          <h1 className="dashboard-title">
            Olá, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="dashboard-subtitle">
            {condition
              ? `Seus materiais são otimizados para ${condition.label}.`
              : 'Bem-vindo à plataforma Adapta.'}
          </p>
          {trail && (
            <Link
              to={`/cursos`}
              id="student-go-courses"
              className="student-trail-cta"
              style={{ background: trail.color }}
            >
              Ver cursos da trilha {trail.label} <ChevronRight size={14} />
            </Link>
          )}
        </div>
        {trail && (
          <div className="student-welcome-icon" style={{ background: trail.color }}>
            {(() => { const Icon = TRAIL_ICONS[trail.id]; return <Icon size={32} color="white" /> })()}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="student-quick-actions">
        <Link to="/cursos" id="student-action-courses" className="student-action-card">
          <div className="student-action-icon" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <p className="student-action-title">Cursos</p>
            <p className="student-action-desc">Explore as trilhas de aprendizado</p>
          </div>
          <ChevronRight size={16} className="student-action-arrow" />
        </Link>

        <Link to="/materiais" id="student-action-materials" className="student-action-card">
          <div className="student-action-icon" style={{ background: 'var(--color-tea-light)', color: 'var(--color-tea)' }}>
            <FolderOpen size={20} />
          </div>
          <div>
            <p className="student-action-title">Meus Materiais</p>
            <p className="student-action-desc">Materiais adaptados pelo professor</p>
          </div>
          <ChevronRight size={16} className="student-action-arrow" />
        </Link>
      </div>

      {/* In-progress courses */}
      {inProgressCourses.length > 0 && (
        <div className="student-in-progress">
          <h2 className="section-title">Continue de onde parou</h2>
          <div className="student-courses-list">
            {inProgressCourses.map(course => {
              const t = TRAILS.find(tr => tr.id === course.trailId)
              const { percent, done, total } = getCourseProgress(course.id)
              const firstUnfinished = course.modules
                .flatMap(m => m.lessons)
                .find(l => !getCourseProgress(course.id))
              const firstLesson = course.modules[0]?.lessons[0]

              return (
                <Link
                  key={course.id}
                  to={`/cursos/${course.id}/aulas/${firstLesson?.id}`}
                  id={`student-continue-${course.id}`}
                  className="student-course-item"
                >
                  <div className="student-course-thumb" style={{ background: t.colorLight }}>
                    <img src={t.thumb} alt={t.label} />
                  </div>
                  <div className="student-course-info">
                    <p className="student-course-title">{course.title}</p>
                    <div className="student-course-progress">
                      <div className="student-progress-bar">
                        <div className="student-progress-fill" style={{ width: `${percent}%`, background: t.color }} />
                      </div>
                      <span className="student-progress-pct" style={{ color: t.color }}>{percent}%</span>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--color-text-subtle)', flexShrink: 0 }} />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state — no courses started */}
      {inProgressCourses.length === 0 && (
        <div className="student-empty">
          <div className="student-empty-icon" style={{ color: 'var(--color-text-muted)' }}>
            <BookOpen size={48} strokeWidth={1.5} />
          </div>
          <p className="student-empty-text">Você ainda não começou nenhum curso.</p>
          <Link to="/cursos" className="btn-primary" id="student-start-learning">
            Explorar cursos
          </Link>
        </div>
      )}
    </div>
  )
}

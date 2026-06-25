import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCourseProgress } from '../../hooks/useCourseProgress'
import { useClasses } from '../../hooks/useClasses'
import { useLibrary } from '../../hooks/useLibrary'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { TRAILS, COURSES } from '../../data/courses'
import {
  Brain, BookOpen, Zap, Eye, Heart,
  Wand2, PlayCircle, ChevronRight, BookMarked, Users,
  ArrowLeft, ArrowRight
} from 'lucide-react'
import './TeacherDashboard.css'

const TRAIL_ICONS = { tea: Brain, dyslexia: BookOpen, adhd: Zap, color_blind: Eye, inclusion: Heart }

const CONDITIONS = [
  { id: 'tea', label: 'TEA', icon: Brain, color: 'var(--color-tea)' },
  { id: 'dyslexia', label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)' },
  { id: 'adhd', label: 'TDAH', icon: Zap, color: 'var(--color-adhd)' },
  { id: 'color_blind', label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)' },
]

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { getTrailProgress, getCourseProgress } = useCourseProgress()
  const { classes } = useClasses()
  const { materials } = useLibrary()
  const { creatorCourses, getCourseStats } = useCreatorCourses()
  
  const carouselRef = useRef(null)
  const studentsCarouselRef = useRef(null)
  const creatorCoursesRef = useRef(null)

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 340 // Largura do card + gap
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const allStudents = (classes || []).flatMap(c => 
    (c.students || []).map(s => ({ ...s, className: c.name, classId: c.id }))
  )

  const totalLessons = COURSES.flatMap(c => c.modules.flatMap(m => m.lessons)).length
  const totalCourses = COURSES.length

  // Stats globais
  const globalDone = TRAILS.reduce((acc, t) => {
    const { done } = getTrailProgress(t.id)
    return acc + done
  }, 0)

  const inProgressCourses = COURSES.filter(c => {
    const { done, total, percent } = getCourseProgress(c.id)
    return done > 0 && percent < 100
  }).length

  const stats = [
    { label: 'Aulas concluídas', value: globalDone, icon: PlayCircle, color: 'var(--color-primary)' },
    { label: 'Cursos em andamento', value: inProgressCourses, icon: BookMarked, color: 'var(--color-tea)' },
    { label: 'Materiais convertidos', value: materials.length, icon: Wand2, color: 'var(--color-adhd)' },
    { label: 'Turmas ativas', value: classes.length, icon: Users, color: 'var(--color-dyslexia)' },
  ]

  return (
    <div className="teacher-dashboard animate-fade-in">
      {/* Promo Card */}
      <div className="promo-card">
        <div className="promo-content">
          <h2 className="promo-title">Extensão Adapta IA</h2>
          <p className="promo-subtitle">
            Transforme qualquer texto da internet em material acessível com apenas um clique! Baixe agora nossa extensão oficial e leve o Adapta para todos os sites.
          </p>
          <a href="/adapta-extension.rar" download="adapta-extension.rar" className="promo-btn">
            <Zap size={16} color="#111827" /> Baixar Extensão Grátis
          </a>
        </div>
        <div className="promo-icon">
          <Brain size={120} color="rgba(255, 255, 255, 0.2)" strokeWidth={1} />
        </div>
      </div>

      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <h1 className="dashboard-title">
            Olá, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="dashboard-subtitle">
            Aqui está um resumo do seu progresso de capacitação.
          </p>
        </div>
        <Link to="/conversor" id="dashboard-cta-converter" className="dashboard-cta-btn">
          <Wand2 size={16} /> Converter material
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                <Icon size={20} />
              </div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cursos Criados pelo Professor */}
      {creatorCourses && creatorCourses.length > 0 && (
        <div className="trails-section">
          <div className="section-header">
            <h2 className="section-title">Cursos criados</h2>
            <Link to="/meus-cursos" className="section-link">
              Ver todos os cursos <ChevronRight size={14} />
            </Link>
          </div>

          <div className="trails-grid" ref={creatorCoursesRef}>
            {creatorCourses.map(course => {
              const stats = getCourseStats(course)
              const cond = CONDITIONS.find(c => c.id === course.profileId) || CONDITIONS[0]
              const Icon = cond.icon

              return (
                <div key={course.id} className="trail-progress-card">
                  <div className="trail-progress-header">
                    <div className="trail-progress-icon" style={{ background: cond.color, color: 'white' }}>
                      <Icon size={20} />
                    </div>
                    <div className="trail-progress-info">
                      <span className="trail-progress-name">{course.title}</span>
                      <span className="trail-progress-meta">Turma vinculada · {stats.total} aulas</span>
                    </div>
                    <span className="trail-progress-pct" style={{ color: 'var(--color-text)' }}>
                      {stats.percent}%
                    </span>
                  </div>

                  <div className="trail-progress-bar">
                    <div
                      className="trail-progress-fill"
                      style={{ width: `${stats.percent}%`, background: cond.color }}
                    />
                  </div>

                  <div className="trail-progress-footer" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: 'none', padding: '0 1.25rem 1.25rem 1.25rem' }}>
                    <Link to={`/meus-cursos/${course.id}`} className="btn-secondary" style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', fontSize: '0.85rem' }}>
                      Editar
                    </Link>
                    <Link to={`/cursos/${course.id}`} className="btn-outline-small" style={{ flex: 1, padding: '0.4rem', justifyContent: 'center', fontSize: '0.85rem', borderColor: cond.color, color: cond.color }}>
                      Ver Curso
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="carousel-nav">
            <button 
              className="carousel-btn" 
              onClick={() => scrollCarousel(creatorCoursesRef, 'left')}
              aria-label="Rolar para a esquerda"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => scrollCarousel(creatorCoursesRef, 'right')}
              aria-label="Rolar para a direita"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Trail progress */}
      <div className="trails-section">
        <div className="section-header">
          <h2 className="section-title">Meu progresso por trilha</h2>
          <Link to="/cursos" className="section-link" id="dashboard-go-courses">
            Ver todos os cursos <ChevronRight size={14} />
          </Link>
        </div>

        <div className="trails-grid" ref={carouselRef}>
          {TRAILS.map(trail => {
            const Icon = TRAIL_ICONS[trail.id]
            const { done, total, percent, courses } = getTrailProgress(trail.id)

            return (
              <div key={trail.id} className="trail-progress-card">
                <div className="trail-progress-header">
                  <div className="trail-progress-icon" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <Icon size={20} />
                  </div>
                  <div className="trail-progress-info">
                    <span className="trail-progress-name">{trail.label}</span>
                    <span className="trail-progress-meta">{courses} cursos · {total} aulas</span>
                  </div>
                  <span className="trail-progress-pct" style={{ color: 'var(--color-text)' }}>
                    {percent}%
                  </span>
                </div>

                <div className="trail-progress-bar">
                  <div
                    className="trail-progress-fill"
                    style={{ width: `${percent}%`, background: 'var(--color-text-muted)' }}
                  />
                </div>

                <div className="trail-progress-footer">
                  <span className="trail-progress-done">{done} de {total} aulas concluídas</span>
                  <Link
                    to={`/cursos?trail=${trail.id}`}
                    id={`dashboard-trail-${trail.id}`}
                    className="trail-progress-link"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Ver cursos <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Carousel Navigation */}
        <div className="carousel-nav">
          <button 
            className="carousel-btn" 
            onClick={() => scrollCarousel(carouselRef, 'left')}
            aria-label="Rolar para a esquerda"
          >
            <ArrowLeft size={18} />
          </button>
          <button 
            className="carousel-btn" 
            onClick={() => scrollCarousel(carouselRef, 'right')}
            aria-label="Rolar para a direita"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Alunos section */}
      {allStudents.length > 0 && (
        <div className="trails-section">
          <div className="section-header">
            <h2 className="section-title">Alunos Matriculados</h2>
            <Link to="/turmas" className="section-link">
              Ver todas as turmas <ChevronRight size={14} />
            </Link>
          </div>

          <div className="trails-grid" ref={studentsCarouselRef}>
            {allStudents.map(student => {
              const cond = CONDITIONS.find(c => c.id === student.condition)
              return (
                <Link to={`/turmas/${student.classId}`} key={`${student.classId}-${student.id}`} className="dashboard-student-card">
                  <div className="student-card-avatar" style={{ background: cond?.color || 'var(--color-primary)' }}>
                    {student.name[0].toUpperCase()}
                  </div>
                  <div className="student-card-info">
                    <span className="student-card-name">{student.name}</span>
                    <span className="student-card-class">Turma: {student.className}</span>
                    {cond && (
                      <span className="student-card-badge" style={{ color: cond.color, background: `color-mix(in srgb, ${cond.color} 15%, white)` }}>
                        <cond.icon size={10} /> {cond.label}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* Carousel Navigation */}
          <div className="carousel-nav">
            <button 
              className="carousel-btn" 
              onClick={() => scrollCarousel(studentsCarouselRef, 'left')}
              aria-label="Rolar para a esquerda"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => scrollCarousel(studentsCarouselRef, 'right')}
              aria-label="Rolar para a direita"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

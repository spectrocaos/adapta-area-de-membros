import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TRAILS, COURSES } from '../../data/courses'
import { useCourseProgress } from '../../hooks/useCourseProgress'
import {
  Brain, BookOpen, Zap, Eye, Heart, LayoutGrid,
  Clock, PlayCircle, ChevronRight
} from 'lucide-react'
import './CourseCatalogPage.css'

const TRAIL_ICONS = { tea: Brain, dyslexia: BookOpen, adhd: Zap, color_blind: Eye, inclusion: Heart }

function ProgressBar({ percent, color }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  )
}

function CourseCard({ course, trail, progress }) {
  const { done, total, percent } = progress
  const Icon = TRAIL_ICONS[trail.id] || LayoutGrid
  const firstLesson = course.modules[0]?.lessons[0]

  return (
    <div className="course-card animate-fade-in">
      <div className="course-card-thumb" style={{ background: trail.colorLight }}>
        <img src={trail.thumb} alt={trail.label} className="course-card-img" />
        <span className="course-card-badge" style={{ background: trail.color, color: 'white' }}>
          <Icon size={11} />
          {trail.label}
        </span>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">{course.description}</p>

        <div className="course-card-meta">
          <span className="course-meta-item">
            <Clock size={13} /> {course.duration}
          </span>
          <span className="course-meta-item">
            <PlayCircle size={13} /> {total} aulas
          </span>
        </div>

        <div className="course-card-progress">
          <ProgressBar percent={percent} color={trail.color} />
          <span className="course-progress-label">
            {percent > 0 ? `${done} de ${total} aulas` : 'Não iniciado'}
          </span>
        </div>

        <Link
          to={firstLesson ? `/cursos/${course.id}/aulas/${firstLesson.id}` : `/cursos/${course.id}`}
          className="course-card-btn"
          style={{ '--btn-color': trail.color }}
          id={`course-card-${course.id}`}
        >
          {percent === 0 ? 'Começar' : percent === 100 ? 'Revisitar' : 'Continuar'}
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  )
}

export default function CourseCatalogPage() {
  const [activeTrail, setActiveTrail] = useState('all')
  const { getCourseProgress } = useCourseProgress()

  const filteredCourses = activeTrail === 'all'
    ? COURSES
    : COURSES.filter(c => c.trailId === activeTrail)

  return (
    <div className="catalog-page">
      {/* Header */}
      <div className="catalog-header">
        <h1 className="catalog-title">Cursos de Capacitação</h1>
        <p className="catalog-subtitle">
          Trilhas especializadas para apoiar alunos neurodivergentes em sala de aula
        </p>
      </div>

      {/* Trail filter */}
      <div className="trail-filter" role="tablist" aria-label="Filtrar por trilha">
        <button
          id="filter-all"
          role="tab"
          aria-selected={activeTrail === 'all'}
          className={`trail-chip ${activeTrail === 'all' ? 'active' : ''}`}
          style={activeTrail === 'all' ? { '--chip-c': 'var(--color-primary)' } : {}}
          onClick={() => setActiveTrail('all')}
        >
          <LayoutGrid size={14} /> Todas
        </button>

        {TRAILS.map(trail => {
          const Icon = TRAIL_ICONS[trail.id]
          const isActive = activeTrail === trail.id
          return (
            <button
              key={trail.id}
              id={`filter-${trail.id}`}
              role="tab"
              aria-selected={isActive}
              className={`trail-chip ${isActive ? 'active' : ''}`}
              style={isActive ? { '--chip-c': trail.color } : {}}
              onClick={() => setActiveTrail(trail.id)}
            >
              <Icon size={14} /> {trail.label}
            </button>
          )
        })}
      </div>

      {/* Trail hero (quando filtrado) */}
      {activeTrail !== 'all' && (() => {
        const trail = TRAILS.find(t => t.id === activeTrail)
        return (
          <div className="trail-hero" style={{ background: trail.colorLight, borderColor: trail.color }}>
            <div className="trail-hero-icon" style={{ background: trail.color }}>
              {(() => { const Icon = TRAIL_ICONS[trail.id]; return <Icon size={24} color="white" /> })()}
            </div>
            <div>
              <h2 className="trail-hero-title" style={{ color: trail.colorDark }}>{trail.fullLabel}</h2>
              <p className="trail-hero-desc">{trail.description}</p>
            </div>
          </div>
        )
      })()}

      {/* Courses grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => {
          const trail = TRAILS.find(t => t.id === course.trailId)
          const progress = getCourseProgress(course.id)
          return (
            <CourseCard key={course.id} course={course} trail={trail} progress={progress} />
          )
        })}
      </div>
    </div>
  )
}

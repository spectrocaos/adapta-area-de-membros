import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCourseById as getStaticCourseById, getTrailById } from '../../data/courses'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { useCourseProgress } from '../../hooks/useCourseProgress'
import {
  Clock, PlayCircle, ChevronDown, CheckCircle2,
  Circle, ChevronRight, ArrowLeft, User
} from 'lucide-react'
import './CourseDetailPage.css'

function ProgressBar({ percent, color }) {
  return (
    <div className="detail-progress-bar">
      <div className="detail-progress-fill" style={{ width: `${percent}%`, background: color }} />
    </div>
  )
}

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { getCourseById: getCreatorCourse } = useCreatorCourses()
  const staticCourse = getStaticCourseById(courseId)
  const creatorCourse = getCreatorCourse(courseId)
  const course = creatorCourse || staticCourse

  const { isLessonDone, getCourseProgress, getFirstUnfinishedLesson } = useCourseProgress()
  const [openModules, setOpenModules] = useState(
    course && course.modules ? { [course.modules[0]?.id]: true } : {}
  )

  if (!course) {
    return (
      <div className="not-found">
        <p>Curso não encontrado.</p>
        <Link to="/cursos">← Voltar ao catálogo</Link>
      </div>
    )
  }

  let done = 0
  let total = 0
  let percent = 0
  let firstUnfinished = null
  let trail = null

  if (creatorCourse) {
    const allLessons = course.modules?.flatMap(m => m.lessons) || []
    total = allLessons.length
    done = allLessons.filter(l => isLessonDone(l.id)).length
    percent = total === 0 ? 0 : Math.round((done / total) * 100)
    firstUnfinished = allLessons.find(l => !isLessonDone(l.id)) || allLessons[0]
    trail = { color: 'var(--color-primary)', colorLight: 'var(--color-surface)', label: 'Curso Adaptado', thumb: course.thumb || '/history_course_cover.png' }
  } else {
    trail = getTrailById(course.trailId)
    const progress = getCourseProgress(courseId)
    done = progress.done
    total = progress.total
    percent = progress.percent
    firstUnfinished = getFirstUnfinishedLesson(courseId)
  }

  const allLessons = course.modules?.flatMap(m => m.lessons) || []

  function toggleModule(modId) {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }))
  }

  return (
    <div className="course-detail-page animate-fade-in">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate(creatorCourse ? '/meus-cursos' : '/cursos')}>
        <ArrowLeft size={16} /> {creatorCourse ? 'Meus Cursos' : 'Catálogo'}
      </button>

      {/* Hero */}
      <div className="course-hero" style={{ background: `linear-gradient(135deg, ${trail.colorLight} 0%, white 100%)`, borderColor: trail.color }}>
        <div className="course-hero-img-wrap">
          <img src={trail.thumb} alt={trail.label} className="course-hero-img" />
        </div>
        <div className="course-hero-info">
          <span className="course-hero-trail" style={{ color: trail.color, background: trail.colorLight, borderColor: trail.color }}>
            {trail.label}
          </span>
          <h1 className="course-hero-title">{course.title}</h1>
          <p className="course-hero-desc">{course.description}</p>
          <div className="course-hero-meta">
            <span><User size={14} /> {course.instructor}</span>
            <span><Clock size={14} /> {course.duration}</span>
            <span><PlayCircle size={14} /> {total} aulas</span>
          </div>
          <div className="course-hero-progress">
            <div className="course-hero-progress-info">
              <span style={{ color: trail.color, fontWeight: 'var(--weight-semibold)' }}>
                {percent}% concluído
              </span>
              <span className="course-progress-count">{done} de {total} aulas</span>
            </div>
            <ProgressBar percent={percent} color={trail.color} />
          </div>
          {firstUnfinished && (
            <Link
              to={creatorCourse ? `/meus-cursos/${courseId}/view/aulas/${firstUnfinished.id}` : `/cursos/${courseId}/aulas/${firstUnfinished.id}`}
              id="btn-continue-course"
              className="course-continue-btn"
              style={{ background: trail.color }}
            >
              {percent === 0 ? 'Começar curso' : 'Continuar'} <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="modules-section">
        <h2 className="modules-title">Conteúdo do curso</h2>
        <p className="modules-count">{course.modules.length} módulos · {total} aulas · {course.duration}</p>

        <div className="modules-list">
          {course.modules.map((mod, modIdx) => {
            const isOpen = !!openModules[mod.id]
            const modDone = mod.lessons.filter(l => isLessonDone(l.id)).length

            return (
              <div key={mod.id} className="module-item">
                <button
                  id={`module-toggle-${mod.id}`}
                  className="module-header"
                  onClick={() => toggleModule(mod.id)}
                  aria-expanded={isOpen}
                >
                  <div className="module-header-left">
                    <span className="module-number">Módulo {modIdx + 1}</span>
                    <span className="module-title">{mod.title}</span>
                  </div>
                  <div className="module-header-right">
                    <span className="module-meta">{modDone}/{mod.lessons.length} aulas</span>
                    <ChevronDown
                      size={16}
                      className="module-chevron"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </div>
                </button>

                {isOpen && (
                  <ul className="lessons-list animate-fade-in">
                    {mod.lessons.map((lesson, lessonIdx) => {
                      const done = isLessonDone(lesson.id)
                      return (
                        <li key={lesson.id}>
                          <Link
                            to={creatorCourse ? `/meus-cursos/${courseId}/view/aulas/${lesson.id}` : `/cursos/${courseId}/aulas/${lesson.id}`}
                            id={`lesson-link-${lesson.id}`}
                            className={`lesson-item ${done ? 'done' : ''}`}
                          >
                            <span className="lesson-check" style={{ color: done ? trail.color : 'var(--color-gray-300)' }}>
                              {done
                                ? <CheckCircle2 size={18} />
                                : <Circle size={18} />
                              }
                            </span>
                            <span className="lesson-title">
                              {lessonIdx + 1}. {lesson.title}
                            </span>
                            <span className="lesson-duration">
                              <Clock size={12} /> {lesson.duration}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

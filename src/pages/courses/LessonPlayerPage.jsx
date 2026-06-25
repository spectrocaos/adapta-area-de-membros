import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCourseById, getTrailById, getLessonById, getAdjacentLessons } from '../../data/courses'
import { useCourseProgress } from '../../hooks/useCourseProgress'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Clock, ArrowLeft, PlayCircle
} from 'lucide-react'
import './LessonPlayerPage.css'

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { isLessonDone, markLessonDone, markLessonUndone } = useCourseProgress()
  const { getCourseById: getCreatorCourse } = useCreatorCourses()

  const creatorCourse = getCreatorCourse(courseId)
  
  let lesson, currentModule, course, trail, prev, next

  if (creatorCourse) {
    course = creatorCourse
    trail = { color: 'var(--color-primary)', colorLight: 'var(--color-surface)', label: 'Curso Adaptado' }
    course.modules?.forEach((m) => {
      const lIdx = m.lessons?.findIndex(l => l.id === lessonId)
      if (lIdx !== -1 && lIdx !== undefined) {
        lesson = m.lessons[lIdx]
        currentModule = m
        prev = lIdx > 0 ? m.lessons[lIdx - 1] : null
        next = lIdx < m.lessons.length - 1 ? m.lessons[lIdx + 1] : null
      }
    })
  } else {
    const result = getLessonById(courseId, lessonId)
    if (result) {
      lesson = result.lesson
      currentModule = result.module
      course = result.course
      trail = getTrailById(course.trailId)
      const adj = getAdjacentLessons(courseId, lessonId)
      prev = adj.prev
      next = adj.next
    }
  }

  if (!lesson) {
    return (
      <div className="not-found">
        <p>Aula não encontrada.</p>
        <Link to="/cursos">← Voltar ao catálogo</Link>
      </div>
    )
  }
  const done = isLessonDone(lessonId)
  const allLessons = course.modules.flatMap(m => m.lessons)

  function handleMarkDone() {
    if (done) {
      markLessonUndone(lessonId)
    } else {
      markLessonDone(lessonId)
      if (next) {
        setTimeout(() => navigate(creatorCourse ? `/meus-cursos/${courseId}/view/aulas/${next.id}` : `/cursos/${courseId}/aulas/${next.id}`), 600)
      }
    }
  }

  return (
    <div className="player-page animate-fade-in">
      {/* Back to course */}
      <Link to={creatorCourse ? `/meus-cursos/${courseId}/view` : `/cursos/${courseId}`} className="back-btn">
        <ArrowLeft size={16} /> {course.title}
      </Link>

      <div className="player-layout">
        {/* Main: Player + controls */}
        <div className="player-main">
          {/* Video player */}
          <div className="player-video-wrap">
            <iframe
              id="lesson-player"
              src={lesson.videoUrl}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="player-iframe"
            />
          </div>

          {/* Lesson info */}
          <div className="player-info">
            <div className="player-trail-badge" style={{ color: trail.color, background: trail.colorLight, borderColor: trail.color }}>
              {trail.label} · {currentModule.title}
            </div>
            <h1 className="player-title">{lesson.title}</h1>
            <div className="player-meta">
              <Clock size={14} /> {lesson.duration}
            </div>
          </div>

          {/* Activities */}
          {lesson.activities && lesson.activities.length > 0 && (
            <div className="player-activities" style={{ padding: '0 2rem 2rem 2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Atividades de Fixação</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lesson.activities.map(act => (
                  <div key={act.id} style={{ padding: '1.25rem', border: `1px solid ${trail.colorLight}`, borderRadius: '8px', background: 'var(--color-surface)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: trail.color }}>{act.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{act.content}</p>
                    
                    {act.title.includes('Escuta') && (
                      <audio controls style={{ width: '100%', height: '40px' }}>
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>
                    )}
                    {(act.title.includes('Complete') || act.title.includes('Ordene')) && (
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Simulação: Abrindo atividade interativa.')}>
                        Iniciar Atividade
                      </button>
                    )}
                    {act.title.includes('Desenhe') && (
                      <button className="btn-outline-small" style={{ padding: '0.5rem 1rem', borderColor: trail.color, color: trail.color }} onClick={() => alert('Abrindo o desenho de exemplo feito pelo professor.')}>
                        Ver desenho do professor
                      </button>
                    )}
                    {act.title.includes('No papel') && (
                      <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => alert('Iniciando impressão da folha de exercícios.')}>
                        Imprimir Folha
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="player-controls">
            <div className="player-nav">
              <button
                id="btn-prev-lesson"
                className="btn-nav"
                onClick={() => prev && navigate(creatorCourse ? `/meus-cursos/${courseId}/view/aulas/${prev.id}` : `/cursos/${courseId}/aulas/${prev.id}`)}
                disabled={!prev}
                aria-label="Aula anterior"
              >
                <ChevronLeft size={16} /> Anterior
              </button>

              <button
                id="btn-mark-done"
                className={`btn-mark-done ${done ? 'done' : ''}`}
                style={done
                  ? { background: trail.colorLight, color: trail.colorDark, borderColor: trail.color }
                  : { background: trail.color, color: 'white' }
                }
                onClick={handleMarkDone}
                aria-pressed={done}
              >
                {done
                  ? <><CheckCircle2 size={16} /> Concluída</>
                  : <><Circle size={16} /> Marcar como concluída</>
                }
              </button>

              <button
                id="btn-next-lesson"
                className="btn-nav"
                onClick={() => next && navigate(creatorCourse ? `/meus-cursos/${courseId}/view/aulas/${next.id}` : `/cursos/${courseId}/aulas/${next.id}`)}
                disabled={!next}
                aria-label="Próxima aula"
              >
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: lesson list */}
        <aside className="player-sidebar">
          <div className="player-sidebar-header">
            <h2 className="player-sidebar-title">Aulas do curso</h2>
            <span className="player-sidebar-count">
              {allLessons.filter(l => isLessonDone(l.id)).length}/{allLessons.length} concluídas
            </span>
          </div>

          <div className="player-lessons-list">
            {course.modules.map(mod => (
              <div key={mod.id} className="player-module-group">
                <p className="player-module-label">{mod.title}</p>
                {mod.lessons.map((l, idx) => {
                  const lDone = isLessonDone(l.id)
                  const isCurrent = l.id === lessonId
                  return (
                    <Link
                      key={l.id}
                      to={creatorCourse ? `/meus-cursos/${courseId}/view/aulas/${l.id}` : `/cursos/${courseId}/aulas/${l.id}`}
                      id={`sidebar-lesson-${l.id}`}
                      className={`player-lesson-item ${isCurrent ? 'current' : ''} ${lDone ? 'done' : ''}`}
                      style={isCurrent ? { borderLeftColor: trail.color, background: trail.colorLight } : {}}
                      aria-current={isCurrent ? 'page' : undefined}
                    >
                      <span className="player-lesson-icon" style={{ color: lDone ? trail.color : 'var(--color-gray-300)' }}>
                        {lDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                      </span>
                      <span className="player-lesson-name">
                        {idx + 1}. {l.title}
                      </span>
                      <span className="player-lesson-dur">{l.duration}</span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

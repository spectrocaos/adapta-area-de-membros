import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { useClasses } from '../../hooks/useClasses'
import { 
  Plus, BookOpen, Brain, Zap, Eye, Heart, 
  ArrowLeft, Clock, PlayCircle, LayoutGrid, ChevronRight
} from 'lucide-react'
import './MyCoursesPage.css'
import './CourseCatalogPage.css' // Reaproveitar alguns estilos dos cards

const CONDITIONS = [
  { id: 'tea', label: 'TEA', icon: Brain, color: 'var(--color-tea)' },
  { id: 'dyslexia', label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)' },
  { id: 'adhd', label: 'TDAH', icon: Zap, color: 'var(--color-adhd)' },
  { id: 'color_blind', label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)' },
]

export default function MyCoursesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { creatorCourses, createCourse, getCourseStats } = useCreatorCourses()
  const { classes } = useClasses()
  
  const isStudent = user?.profile === 'student'
  
  const [view, setView] = useState('list') // 'list' | 'new'
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [classId, setClassId] = useState('')
  const [profileId, setProfileId] = useState('tea')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    if (!title || !classId || !profileId) return
    
    setIsSubmitting(true)
    const newCourseId = await createCourse(title, description, classId, profileId)
    setIsSubmitting(false)
    
    // Redirect to the course editor directly
    navigate(`/meus-cursos/${newCourseId}`)
  }

  if (view === 'new') {
    return (
      <div className="my-courses-page animate-fade-in">
        <div className="my-courses-header">
          <div>
            <button className="btn-secondary" onClick={() => setView('list')} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
              <ArrowLeft size={16} /> Voltar
            </button>
            <h1>Criar Novo Curso</h1>
            <p>Configure a estrutura inicial do curso. Você poderá adicionar aulas na próxima etapa.</p>
          </div>
        </div>

        <div className="course-form-container">
          <form className="course-form" onSubmit={handleCreateCourse}>
            <div className="form-group">
              <label htmlFor="title">Nome do curso</label>
              <input 
                id="title"
                type="text" 
                placeholder="Ex: História do Brasil Adaptada" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Descrição curta</label>
              <textarea 
                id="description"
                placeholder="Um breve resumo sobre o que será ensinado..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="classId">Turma vinculada</label>
              <select 
                id="classId"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
              >
                <option value="" disabled>Selecione uma turma</option>
                <option value="all">Disponível para todas as minhas turmas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="profileId">Perfil de adaptação padrão</label>
              <select 
                id="profileId"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                required
              >
                {CONDITIONS.map(cond => (
                  <option key={cond.id} value={cond.id}>{cond.label}</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setView('list')}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting || !title || !classId}>
                {isSubmitting ? 'Salvando...' : 'Salvar e Continuar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="my-courses-page animate-fade-in">
      <div className="my-courses-header">
        <div>
          <h1>Meus Cursos</h1>
          <p>{isStudent ? 'Cursos adaptados disponíveis para o seu perfil.' : 'Gerencie os cursos e trilhas que você criou para seus alunos.'}</p>
        </div>
        {!isStudent && creatorCourses.length > 0 && (
          <button className="btn-primary" onClick={() => setView('new')}>
            <Plus size={18} /> Novo Curso
          </button>
        )}
      </div>

      {creatorCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BookOpen size={32} />
          </div>
          <h3>{isStudent ? 'Nenhum curso adaptado disponível' : 'Você ainda não criou nenhum curso'}</h3>
          <p>{isStudent ? 'Aguarde até que seus professores criem e disponibilizem os materiais adaptados.' : 'Crie cursos adaptados para suas turmas, selecionando perfis específicos de neurodivergência.'}</p>
          {!isStudent && (
            <button className="btn-primary" onClick={() => setView('new')}>
              <Plus size={18} /> Criar primeiro curso
            </button>
          )}
        </div>
      ) : (
        <div className="courses-grid">
          {creatorCourses.map(course => {
            const stats = getCourseStats(course)
            const cond = CONDITIONS.find(c => c.id === course.profileId) || CONDITIONS[0]
            const Icon = cond.icon

            return (
              <div key={course.id} className="course-card animate-fade-in">
                <div className="course-card-thumb" style={{ background: `color-mix(in srgb, ${cond.color} 20%, transparent)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Icon size={48} color={cond.color} opacity={0.5} />
                  </div>
                  <span className="course-card-badge" style={{ background: cond.color, color: 'white' }}>
                    <Icon size={11} />
                    {cond.label}
                  </span>
                </div>

                <div className="course-card-body">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-desc" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {course.description || 'Sem descrição.'}
                  </p>

                  <div className="course-card-meta" style={{ marginBottom: '1rem' }}>
                    <span className="course-meta-item">
                      <LayoutGrid size={13} /> Turma: {course.classId === 'all' ? 'Todas' : classes.find(c => c.id === course.classId)?.name || 'Desconhecida'}
                    </span>
                    <span className="course-meta-item">
                      <PlayCircle size={13} /> {stats.total} aulas
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isStudent ? (
                      <Link
                        to={`/meus-cursos/${course.id}/view`}
                        className="course-card-btn"
                        style={{ '--btn-color': cond.color, flex: 1, justifyContent: 'center' }}
                      >
                        Acessar Curso
                      </Link>
                    ) : (
                      <>
                        <Link
                          to={`/meus-cursos/${course.id}`}
                          className="course-card-btn"
                          style={{ '--btn-color': cond.color, flex: 1, justifyContent: 'center' }}
                        >
                          Editar
                        </Link>
                        <Link
                          to={`/meus-cursos/${course.id}/view`}
                          className="btn-outline-small"
                          style={{ flex: 1, justifyContent: 'center', borderColor: cond.color, color: cond.color }}
                        >
                          Visualizar
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

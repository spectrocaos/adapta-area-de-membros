import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { 
  ArrowLeft, Plus, PlayCircle, FileText, FileAudio, 
  X, BookOpen, Wand2, Globe, Share2, Users
} from 'lucide-react'
import './CourseEditorPage.css'

function getLessonIcon(type) {
  switch (type) {
    case 'video': return <PlayCircle size={20} />
    case 'audio': return <FileAudio size={20} />
    default: return <FileText size={20} />
  }
}

export default function CourseEditorPage() {
  const { courseId } = useParams()
  const { getCourseById } = useCreatorCourses()
  const course = getCourseById(courseId)
  
  const [showModal, setShowModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  if (!course) {
    return (
      <div className="course-editor-page">
        <p>Curso não encontrado.</p>
        <Link to="/meus-cursos" className="btn-secondary">Voltar</Link>
      </div>
    )
  }

  const handlePublish = () => {
    alert('Curso publicado com sucesso! Agora seus alunos já podem acessar o conteúdo adaptado para seus perfis.')
    // Lógica adicional para alterar status no contexto seria inserida aqui
  }

  return (
    <div className="course-editor-page animate-fade-in">
      <div className="editor-header">
        <Link to="/meus-cursos" className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Voltar aos Meus Cursos
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="course-cover-preview" style={{ position: 'relative', width: '160px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <img src={course.thumb || '/history_course_cover.png'} alt="Capa do Curso" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                className="btn-secondary" 
                style={{ position: 'absolute', bottom: '4px', right: '4px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.9)' }}
                onClick={() => alert('Abrir janela para escolher nova capa da biblioteca.')}
              >
                Alterar Capa
              </button>
            </div>
            <div>
              <h1>{course.title}</h1>
              <p className="editor-meta">{course.description || 'Nenhuma descrição'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn-secondary" onClick={() => setShowShareModal(true)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              <Share2 size={16} /> Compartilhar
            </button>
            <Link to={`/meus-cursos/${courseId}/view`} className="btn-outline" style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              <BookOpen size={16} /> Visualizar Curso
            </Link>
            <button className="btn-primary" onClick={handlePublish} style={{ background: 'var(--color-primary)', padding: '0.5rem 0.75rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
              <Globe size={16} /> Publicar Curso
            </button>
          </div>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Nova Aula
          </button>
        </div>

        {(!course.modules || course.modules.length === 0) ? (
          <div className="empty-state">
            <BookOpen size={48} className="empty-state-icon" style={{ background: 'transparent' }} />
            <h3>Nenhuma aula adicionada</h3>
            <p>Comece a estruturar seu curso adicionando a primeira aula.</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Nova Aula
            </button>
          </div>
        ) : (
          <div className="modules-list">
            {course.modules.map(module => (
              <div key={module.id} className="module-card">
                <h3 className="module-header">{module.title}</h3>
                <div className="lessons-list">
                  {module.lessons.map(lesson => (
                    <div key={lesson.id} className="lesson-item">
                      <div className="lesson-info">
                        <span className="lesson-icon">{getLessonIcon(lesson.type)}</span>
                        <div>
                          <p className="lesson-title">{lesson.title}</p>
                          <p className="lesson-duration">{lesson.duration || '0 min'}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/cursos/${courseId}/aulas/${lesson.id}`} className="btn-outline-small" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          Visualizar
                        </Link>
                        <Link to={`/meus-cursos/${courseId}/aulas/${lesson.id}`} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          Editar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '750px' }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2 className="modal-title">Adicionar Nova Aula</h2>
            
            <div className="route-options">
              {/* Rota A */}
              <div className="route-card">
                <div className="route-icon">
                  <BookOpen size={24} />
                </div>
                <h3 className="route-title">Usar material adaptado</h3>
                <p className="route-desc">
                  Escolha um conteúdo que já foi convertido pelo Estúdio na sua Biblioteca.
                </p>
                <Link to={`/biblioteca?selectForCourse=${course.id}`} className="btn-secondary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                  Abrir Biblioteca
                </Link>
              </div>

              {/* Rota B */}
              <div className="route-card">
                <div className="route-icon">
                  <Wand2 size={24} />
                </div>
                <h3 className="route-title">Criar novo material</h3>
                <p className="route-desc">
                  Faça o upload de um PDF, texto ou vídeo e deixe a IA adaptar agora mesmo.
                </p>
                <Link to={`/conversor?courseId=${course.id}`} className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                  Adaptar Novo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Compartilhar Curso</h2>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Selecione a turma ou digite o e-mail do aluno matriculado para enviar o acesso a esta adaptação.
              </p>
              
              <div className="form-group">
                <label>Turma / Aluno</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-surface)' }}>
                  <Users size={18} color="var(--color-text-muted)" />
                  <input type="text" placeholder="Ex: Turma 3B, joao@escola.com" style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn-secondary" onClick={() => setShowShareModal(false)}>Cancelar</button>
                <button className="btn-primary" onClick={() => {
                  alert(`Curso "${course.title}" compartilhado com sucesso! O aluno receberá a notificação na área de estudo.`)
                  setShowShareModal(false)
                }}>
                  Enviar Acesso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

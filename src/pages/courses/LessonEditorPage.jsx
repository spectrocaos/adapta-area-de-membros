import { useParams, Link } from 'react-router-dom'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { 
  ArrowLeft, FileText, Layers, GripVertical, Trash2, Edit2, 
  Printer, Volume2, Move, HelpCircle, CheckSquare, Plus 
} from 'lucide-react'
import './LessonEditorPage.css'

function getActivityIcon(type) {
  switch (type) {
    case 'audio': return <Volume2 size={24} />
    case 'drag_drop': return <Move size={24} />
    case 'print': return <Printer size={24} />
    case 'quiz': return <HelpCircle size={24} />
    case 'audio_text': return <Volume2 size={24} />
    case 'gamification': return <Layers size={24} />
    case 'interactive_video': return <Layers size={24} />
    default: return <CheckSquare size={24} />
  }
}

export default function LessonEditorPage() {
  const { courseId, lessonId } = useParams()
  const { getCourseById } = useCreatorCourses()
  
  const course = getCourseById(courseId)
  if (!course) return <div className="lesson-editor-page"><p>Curso não encontrado.</p></div>
  
  let lesson = null
  let moduleName = ''
  
  course.modules?.forEach(mod => {
    const found = mod.lessons?.find(l => l.id === lessonId)
    if (found) {
      lesson = found
      moduleName = mod.title
    }
  })

  if (!lesson) return <div className="lesson-editor-page"><p>Aula não encontrada.</p></div>

  // Separar atividades normais da atividade de papel (print)
  const interactiveActivities = lesson.activities?.filter(act => act.type !== 'print') || []
  const printActivity = lesson.activities?.find(act => act.type === 'print')

  return (
    <div className="lesson-editor-page animate-fade-in">
      <div className="lesson-editor-header">
        <div>
          <Link to={`/meus-cursos/${courseId}`} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <ArrowLeft size={16} /> Voltar para o Curso
          </Link>
          <h1>{lesson.title}</h1>
          <p className="lesson-meta">{moduleName} · {lesson.duration || 'Duração flexível'}</p>
        </div>
        <button className="btn-primary">Salvar Alterações</button>
      </div>

      <div className="blocks-container">
        {/* Bloco de Conteúdo Principal */}
        <div className="block-section">
          <div className="block-section-header">
            <FileText size={18} />
            Conteúdo Base Adaptado
          </div>
          <div className="block-section-body">
            <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
              {lesson.activities ? "O conteúdo base foi fragmentado com sucesso. Veja abaixo as micro-atividades geradas." : "O conteúdo base original aparecerá aqui."}
            </p>
          </div>
        </div>

        {/* Blocos de Micro-Atividades */}
        {interactiveActivities.length > 0 && (
          <div className="block-section">
            <div className="block-section-header">
              <Layers size={18} />
              Micro-Atividades Geradas
            </div>
            <div className="block-section-body">
              <div className="activity-list">
                {interactiveActivities.map((act, index) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-icon-wrap">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="activity-info">
                      <h4>{index + 1}. {act.title}</h4>
                      <p className="activity-desc">{act.content}</p>
                    </div>
                    <div className="activity-actions">
                      <button className="action-btn" title="Reordenar"><GripVertical size={16} /></button>
                      <button className="action-btn" title="Editar"><Edit2 size={16} /></button>
                      <button className="action-btn" title="Remover"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Atividade Impressa e Materiais Extras */}
        <div className="block-section">
          <div className="block-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={18} />
              Materiais de Apoio / Anexos
            </div>
            <button className="btn-outline-small" onClick={() => alert('Abrir biblioteca para adicionar PDF, DOCX ou Imagem de apoio.')}>
              <Plus size={14} /> Adicionar
            </button>
          </div>
          
          <div className="block-section-body">
            {printActivity ? (
              <div className="print-block">
                <div className="print-info">
                  <FileText size={32} color="var(--color-primary)" />
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{printActivity.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{printActivity.content}</p>
                  </div>
                </div>
                <button className="btn-secondary">Visualizar Folha de Impressão</button>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Nenhum material de apoio adicionado a esta aula ainda.
              </p>
            )}
          </div>
        </div>

        {/* Bloco de Avaliação Final */}
        <div className="block-section">
          <div className="block-section-header">
            <CheckSquare size={18} />
            Avaliação de Conclusão
          </div>
          <div className="block-section-body">
            <div className="evaluation-block">
              "Como foi a atividade de hoje?" - Bloco de feedback automático ativado.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

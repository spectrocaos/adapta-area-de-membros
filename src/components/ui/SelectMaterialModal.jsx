import { useState, useMemo } from 'react'
import { X, Send, Search, CheckCircle2, FileText, Brain, BookOpen, Zap, Eye, PlaySquare } from 'lucide-react'
import { useLibrary } from '../../hooks/useLibrary'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import './SelectMaterialModal.css'

const CONDITIONS = [
  { id: 'tea', label: 'TEA', icon: Brain, color: 'var(--color-tea)', bg: 'var(--color-tea-light)' },
  { id: 'dyslexia', label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)', bg: 'var(--color-dyslexia-light)' },
  { id: 'adhd', label: 'TDAH', icon: Zap, color: 'var(--color-adhd)', bg: 'var(--color-adhd-light)' },
  { id: 'color_blind', label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)', bg: 'var(--color-color-blind-light)' },
]

export default function SelectMaterialModal({ isOpen, onClose, student, onShare }) {
  const { materials } = useLibrary()
  const { creatorCourses } = useCreatorCourses()
  const [activeTab, setActiveTab] = useState('materials') // 'materials' | 'courses'
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successType, setSuccessType] = useState('material')
  const [selectedId, setSelectedId] = useState(null)

  // Filtra por termo de busca, caso o professor queira achar algo específico
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => 
      m.adapted.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [materials, searchTerm])

  const filteredCourses = useMemo(() => {
    return creatorCourses.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [creatorCourses, searchTerm])

  if (!isOpen) return null

  const handleShare = async (e, id, type = 'material') => {
    e.preventDefault()
    setLoading(true)
    setSelectedId(id)
    setSuccessType(type)
    
    if (onShare) onShare(id, type)

    // Simula disparo de notificação / envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setSuccess(true)
    
    // Auto-fecha após 2.5s
    setTimeout(() => {
      setSuccess(false)
      setSelectedId(null)
      setSearchTerm('')
      onClose()
    }, 2500)
  }

  return (
    <div className="select-material-modal-overlay animate-fade-in">
      <div className="select-material-modal-card glass-card animate-fade-scale">
        <button className="select-material-modal-close" onClick={onClose} disabled={loading || success}>
          <X size={20} />
        </button>
        
        {success ? (
          <div className="select-material-modal-success animate-fade-in">
            <CheckCircle2 size={48} color="var(--color-primary)" />
            <h3>{successType === 'course' ? 'Curso Enviado!' : 'Material Enviado!'}</h3>
            <p>O {successType === 'course' ? 'curso' : 'material'} foi compartilhado com o aluno <strong>{student?.name}</strong> com sucesso.</p>
          </div>
        ) : (
          <>
            <h2 className="select-material-modal-title">Compartilhar com Aluno</h2>
            <p className="select-material-modal-subtitle">
              Escolha um material ou curso para enviar para <strong>{student?.name}</strong>.
            </p>
            
            <div className="modal-tabs" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <button 
                style={{ padding: '0.5rem 1rem', borderBottom: activeTab === 'materials' ? '2px solid var(--color-primary)' : 'none', background: 'transparent', fontWeight: activeTab === 'materials' ? 'var(--weight-semibold)' : 'normal', color: activeTab === 'materials' ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer' }}
                onClick={() => setActiveTab('materials')}
              >
                Materiais ({filteredMaterials.length})
              </button>
              <button 
                style={{ padding: '0.5rem 1rem', borderBottom: activeTab === 'courses' ? '2px solid var(--color-primary)' : 'none', background: 'transparent', fontWeight: activeTab === 'courses' ? 'var(--weight-semibold)' : 'normal', color: activeTab === 'courses' ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer' }}
                onClick={() => setActiveTab('courses')}
              >
                Cursos ({filteredCourses.length})
              </button>
            </div>

            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder={activeTab === 'materials' ? "Buscar materiais..." : "Buscar cursos..."}
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="materials-list">
              {activeTab === 'materials' && (
                filteredMaterials.length === 0 ? (
                  <div className="materials-empty">Nenhum material encontrado.</div>
                ) : (
                  filteredMaterials.map(material => {
                    const cond = CONDITIONS.find(c => c.id === material.condition)
                    const isSendingThis = loading && selectedId === material.id
                    return (
                      <div key={material.id} className="material-list-item">
                        <div className="material-item-info">
                          <div className="material-item-header">
                            <span className="material-badge" style={{ color: cond?.color, background: cond?.bg }}>
                              {cond && <cond.icon size={12} />} {cond?.label}
                            </span>
                            <span className="material-date">
                              {new Date(material.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="material-preview">
                            {material.adapted.substring(0, 80).replace(/[#*`]/g, '')}...
                          </p>
                        </div>
                        <button 
                          className="btn-primary btn-send-material"
                          onClick={(e) => handleShare(e, material.id, 'material')}
                          disabled={loading}
                        >
                          {isSendingThis ? <span className="spinner" /> : <><Send size={14} /> Enviar</>}
                        </button>
                      </div>
                    )
                  })
                )
              )}

              {activeTab === 'courses' && (
                filteredCourses.length === 0 ? (
                  <div className="materials-empty">Nenhum curso encontrado.</div>
                ) : (
                  filteredCourses.map(course => {
                    const isSendingThis = loading && selectedId === course.id
                    return (
                      <div key={course.id} className="material-list-item">
                        <div className="material-item-info">
                          <div className="material-item-header">
                            <span className="material-badge" style={{ color: 'var(--color-primary)', background: 'var(--color-surface)' }}>
                              <PlaySquare size={12} /> Curso Criado
                            </span>
                            <span className="material-date">
                              {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="material-preview" style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                            {course.title}
                          </p>
                          <p className="material-preview" style={{ fontSize: '0.85rem' }}>
                            {course.description ? course.description.substring(0, 60) + '...' : 'Sem descrição.'}
                          </p>
                        </div>
                        <button 
                          className="btn-primary btn-send-material"
                          onClick={(e) => handleShare(e, course.id, 'course')}
                          disabled={loading}
                        >
                          {isSendingThis ? <span className="spinner" /> : <><Send size={14} /> Enviar</>}
                        </button>
                      </div>
                    )
                  })
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

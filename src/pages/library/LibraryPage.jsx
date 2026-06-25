import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useLibrary } from '../../hooks/useLibrary'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { mockAdaptationPipeline } from '../../services/mockAdaptationPipeline'
import {
  FileText, Wand2, Trash2, Download, ExternalLink,
  Brain, BookOpen, Zap, Eye, Heart, FolderOpen, Share2,
  Presentation, Network, Copy, HelpCircle, BarChart2, Table, Filter, X
} from 'lucide-react'
import ShareModal from '../../components/ui/ShareModal'
import './LibraryPage.css'

const CONDITIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'tea', label: 'TEA', icon: Brain, color: 'var(--color-tea)', bg: 'var(--color-tea-light)' },
  { id: 'dyslexia', label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)', bg: 'var(--color-dyslexia-light)' },
  { id: 'adhd', label: 'TDAH', icon: Zap, color: 'var(--color-adhd)', bg: 'var(--color-adhd-light)' },
  { id: 'color_blind', label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)', bg: 'var(--color-color-blind-light)' },
]

const FORMATS = [
  { id: 'all', label: 'Todos os Tipos', icon: FolderOpen },
  { id: 'resumo_texto', label: 'Resumo em Texto', icon: FileText },
  { id: 'apresentacao', label: 'Apresentação', icon: Presentation },
  { id: 'mapa_mental', label: 'Mapa Mental', icon: Network },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'flashcards', label: 'Cartões (Flashcards)', icon: Copy },
  { id: 'teste', label: 'Teste', icon: HelpCircle },
  { id: 'infografico', label: 'Infográfico', icon: BarChart2 },
  { id: 'tabela', label: 'Tabela de dados', icon: Table }
]

export default function LibraryPage() {
  const { materials, deleteMaterial } = useLibrary()
  const [filterCondition, setFilterCondition] = useState('all')
  const [filterFormat, setFilterFormat] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [materialToShare, setMaterialToShare] = useState(null)

  const [adaptationModalOpen, setAdaptationModalOpen] = useState(false)
  const [selectedMaterialToAdapt, setSelectedMaterialToAdapt] = useState(null)
  const [targetProfile, setTargetProfile] = useState('tea')
  const [lessonName, setLessonName] = useState('')
  const [isAdapting, setIsAdapting] = useState(false)

  const [searchParams] = useSearchParams()
  const selectForCourse = searchParams.get('selectForCourse')
  const navigate = useNavigate()
  const { addLessonToCourse } = useCreatorCourses()

  const filteredMaterials = materials.filter(m => {
    const matchCondition = filterCondition === 'all' || m.condition === filterCondition
    const matchFormat = filterFormat === 'all' || m.format === filterFormat
    const matchDate = !filterDate || new Date(m.createdAt).toISOString().split('T')[0] === filterDate
    const matchSubject = !filterSubject || (m.subject || '').toLowerCase().includes(filterSubject.toLowerCase())
    return matchCondition && matchFormat && matchDate && matchSubject
  })

  const handleDownload = (material) => {
    const blob = new Blob([material.adapted], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Adaptado_${material.condition}_${new Date(material.createdAt).getTime()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este material?')) {
      deleteMaterial(id)
    }
  }

  const handleSelectForCourse = (material) => {
    if (!selectForCourse) return
    setSelectedMaterialToAdapt(material)
    setLessonName(material.format ? `Material Adaptado (${material.format})` : 'Material Adicionado')
    setAdaptationModalOpen(true)
  }

  const confirmAdaptation = async () => {
    setIsAdapting(true)
    const adaptation = await mockAdaptationPipeline(selectedMaterialToAdapt.original || selectedMaterialToAdapt.adapted, targetProfile)
    
    addLessonToCourse(selectForCourse, {
      title: lessonName || 'Material Adicionado',
      type: 'text',
      duration: '5 min',
      activities: adaptation.activities
    })
    setIsAdapting(false)
    navigate(`/meus-cursos/${selectForCourse}`)
  }

  return (
    <div className="library-page animate-fade-in">
      <div className="library-header">
        <div>
          <h1 className="library-title">Minha Biblioteca</h1>
          <p className="library-subtitle">Histórico de todos os seus materiais adaptados.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn-outline" onClick={() => setIsFilterModalOpen(true)}>
            <Filter size={16} /> Filtros
          </button>
          <Link to="/conversor" className="btn-primary">
            <Wand2 size={16} /> Novo Material
          </Link>
        </div>
      </div>

      {filteredMaterials.length > 0 ? (
        <div className="library-grid">
          {filteredMaterials.map(material => {
            const cond = CONDITIONS.find(c => c.id === material.condition)
            return (
              <div key={material.id} className="material-card">
                <div className="material-card-header">
                  <span className="material-badge" style={{ color: cond?.color, background: cond?.bg }}>
                    {cond && <cond.icon size={12} />} {cond?.label}
                  </span>
                  <span className="material-date">
                    {new Date(material.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="material-card-body">
                  <div className="material-icon">
                    <FileText size={24} color="var(--color-text-muted)" />
                  </div>
                  <p className="material-preview">
                    {material.adapted.substring(0, 120).replace(/[#*`]/g, '')}...
                  </p>
                </div>

                <div className="material-card-footer">
                  <div className="material-actions">
                    <button className="btn-icon" onClick={() => { setMaterialToShare(material); setShareModalOpen(true); }} title="Compartilhar com aluno">
                      <Share2 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => handleDownload(material)} title="Baixar">
                      <Download size={16} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(material.id)} title="Deletar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {selectForCourse ? (
                    <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleSelectForCourse(material)}>
                      Selecionar
                    </button>
                  ) : (
                    <button className="btn-outline-small" onClick={() => alert('Visualizador em breve!')}>
                      <ExternalLink size={14} /> Ver completo
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="library-empty">
          <FolderOpen size={48} className="empty-icon" />
          <h2 className="empty-title">Nenhum material encontrado</h2>
          <p className="empty-subtitle">
            Nenhum material adaptado atende aos filtros selecionados.
          </p>
          <Link to="/conversor" className="btn-primary">
            Começar a adaptar
          </Link>
        </div>
      )}

      {/* ── MODAL DE FILTROS ── */}
      {isFilterModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 className="modal-title" style={{ marginBottom: 0 }}>Filtrar Materiais</h2>
              <button className="btn-icon" onClick={() => setIsFilterModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-form">
              <div className="form-group">
                <label>Tipo de Neurodivergência</label>
                <select value={filterCondition} onChange={e => setFilterCondition(e.target.value)}>
                  {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Arquivo</label>
                <select value={filterFormat} onChange={e => setFilterFormat(e.target.value)}>
                  {FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Data de Criação</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Matéria (Ex: Matemática, Português)</label>
                <input type="text" placeholder="Buscar por matéria..." value={filterSubject} onChange={e => setFilterSubject(e.target.value)} />
              </div>

              <div className="modal-actions" style={{ marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn-outline" onClick={() => {
                  setFilterCondition('all')
                  setFilterFormat('all')
                  setFilterDate('')
                  setFilterSubject('')
                }}>
                  Limpar Filtros
                </button>
                <button type="button" className="btn-primary" onClick={() => setIsFilterModalOpen(false)}>
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        materialName={materialToShare?.condition} 
      />

      {adaptationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
            {isAdapting ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Brain size={48} color="var(--color-primary)" className="pulse" style={{ margin: '0 auto 1rem auto' }} />
                <h3>Adaptando para o perfil...</h3>
                <p>O motor de IA está extraindo as atividades para este curso.</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>Configurar Nova Aula</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome da Aula</label>
                  <input 
                    type="text" 
                    value={lessonName} 
                    onChange={e => setLessonName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Perfil de adaptação para esta aula</label>
                  <select 
                    value={targetProfile} 
                    onChange={e => setTargetProfile(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  >
                    {CONDITIONS.filter(c => c.id !== 'all').map(cond => (
                      <option key={cond.id} value={cond.id}>{cond.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" onClick={() => setAdaptationModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={confirmAdaptation}>Criar Aula Adaptada</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

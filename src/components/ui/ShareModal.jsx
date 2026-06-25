import { useState, useMemo } from 'react'
import { X, Send, Search, MessageSquare, CheckCircle2, User, Brain, BookOpen, Zap, Eye, Heart, Users, Mail } from 'lucide-react'
import { useClasses } from '../../hooks/useClasses'
import './ShareModal.css'

const CONDITION_INFO = {
  tea: { label: 'TEA', icon: Brain, color: 'var(--color-tea)' },
  dyslexia: { label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)' },
  adhd: { label: 'TDAH', icon: Zap, color: 'var(--color-adhd)' },
  color_blind: { label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)' },
  inclusion: { label: 'Inclusão', icon: Heart, color: 'var(--color-inclusion)' }
}

export default function ShareModal({ isOpen, onClose, materialName }) {
  const [mode, setMode] = useState('list') // 'list' | 'email'
  const [email, setEmail] = useState('')
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { classes } = useClasses()
  
  const allStudents = useMemo(() => {
    return (classes || []).flatMap(c => 
      (c.students || []).map(s => ({ ...s, className: c.name }))
    )
  }, [classes])

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return allStudents
    const query = search.toLowerCase()
    return allStudents.filter(s => 
      s.name.toLowerCase().includes(query) || 
      (s.email && s.email.toLowerCase().includes(query))
    )
  }, [search, allStudents])

  if (!isOpen) return null

  const handleShare = async (e) => {
    e.preventDefault()
    if (mode === 'list' && !selectedStudent) return
    if (mode === 'email' && !email.trim()) return
    
    setLoading(true)
    // Simulando disparo de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setSuccess(true)
    
    // Auto-fecha após 2.5s
    setTimeout(() => {
      setSuccess(false)
      setSelectedStudent(null)
      setEmail('')
      setSearch('')
      setMessage('')
      onClose()
    }, 2500)
  }

  return (
    <div className="share-modal-overlay animate-fade-in">
      <div className="share-modal-card glass-card animate-fade-scale">
        <button className="share-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        {success ? (
          <div className="share-modal-success animate-fade-in">
            <CheckCircle2 size={48} color="var(--color-primary)" />
            <h3>Enviado com sucesso!</h3>
            <p>O material foi compartilhado com <strong>{mode === 'list' ? selectedStudent?.name : email}</strong>.</p>
          </div>
        ) : (
          <>
            <h2 className="share-modal-title">Compartilhar Material</h2>
            <p className="share-modal-subtitle">
              Escolha um aluno da sua lista ou digite o e-mail diretamente.
            </p>

            <div className="share-mode-tabs">
              <button 
                className={`share-mode-tab ${mode === 'list' ? 'active' : ''}`}
                onClick={() => setMode('list')}
              >
                <Users size={16} /> Meus Alunos
              </button>
              <button 
                className={`share-mode-tab ${mode === 'email' ? 'active' : ''}`}
                onClick={() => setMode('email')}
              >
                <Mail size={16} /> E-mail Avulso
              </button>
            </div>
            
            <form className="share-modal-form" onSubmit={handleShare}>
              {mode === 'list' ? (
                <>
                  <div className="form-group">
                    <div className="input-wrapper">
                      <Search size={16} className="input-icon" />
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Pesquisar por nome do aluno..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="student-list-container">
                    {filteredStudents.length > 0 ? (
                      <ul className="student-share-list">
                        {filteredStudents.map(student => {
                          const condInfo = CONDITION_INFO[student.condition]
                          const CondIcon = condInfo?.icon || User
                          return (
                            <li 
                              key={student.id} 
                              className={`student-share-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                              onClick={() => setSelectedStudent(student)}
                            >
                              <div className="student-share-avatar" style={{ background: condInfo?.color || 'var(--color-primary)' }}>
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="student-share-info">
                                <strong className="student-share-name">{student.name}</strong>
                                <span className="student-share-class">{student.className}</span>
                              </div>
                              {condInfo && (
                                <div className="student-share-tag" style={{ color: condInfo.color, backgroundColor: `${condInfo.color}15` }}>
                                  <CondIcon size={12} />
                                  <span>{condInfo.label}</span>
                                </div>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="empty-students">
                        <p>Nenhum aluno encontrado.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label className="form-label">E-mail do destinatário</label>
                  <div className="input-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="aluno@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={mode === 'email'}
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Mensagem (opcional)</label>
                <div className="input-wrapper text-area-wrapper">
                  <MessageSquare size={16} className="input-icon top-icon" />
                  <textarea 
                    className="form-input" 
                    placeholder="Deixe um recado para o aluno sobre este material..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary btn-full share-submit-btn"
                disabled={loading || (mode === 'list' ? !selectedStudent : !email.trim())}
              >
                {loading ? <span className="spinner" /> : <><Send size={16} /> Enviar Material</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

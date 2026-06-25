import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../../hooks/useLibrary'
import {
  Settings2, Trash2, ArrowRight, Brain, BookOpen, Zap, Eye,
  Bookmark, Plus, X, FileText, ChevronDown, ChevronUp
} from 'lucide-react'
import './ConversionProfilesPage.css'

const CONDITION_INFO = {
  tea:         { label: 'TEA',        icon: Brain,    color: 'var(--color-tea)' },
  dyslexia:    { label: 'Dislexia',   icon: BookOpen, color: 'var(--color-dyslexia)' },
  adhd:        { label: 'TDAH',       icon: Zap,      color: 'var(--color-adhd)' },
  color_blind: { label: 'Daltonismo', icon: Eye,      color: 'var(--color-color-blind)' },
}

const ALL_PARAMS = {
  tea: [
    { id: 'shortSentences',  label: 'Frases curtas (máx 15 pal.)' },
    { id: 'removeFigures',   label: 'Remover figuras de linguagem' },
    { id: 'listFormat',      label: 'Estruturar em listas' },
    { id: 'concreteVocab',   label: 'Vocabulário concreto' },
  ],
  dyslexia: [
    { id: 'shortParagraphs', label: 'Parágrafos curtos' },
    { id: 'boldKeywords',    label: 'Destacar palavras-chave em negrito' },
    { id: 'simpleVocab',     label: 'Vocabulário simplificado' },
  ],
  adhd: [
    { id: 'summaryFirst',    label: 'Incluir resumo no início' },
    { id: 'bulletPoints',    label: 'Forçar uso de bullet points' },
    { id: 'shortBlocks',     label: 'Blocos curtos (máx 4 linhas)' },
    { id: 'removeRepetitions', label: 'Remover repetições' },
  ],
  color_blind: [
    { id: 'noColorRefs',     label: 'Remover referências de cores' },
    { id: 'describePatterns',label: 'Descrever padrões e formas' },
    { id: 'highContrastText',label: 'Alto contraste em tabelas/gráficos' },
  ],
}

const defaultParams = (condition) =>
  (ALL_PARAMS[condition] || []).reduce((acc, p) => ({ ...acc, [p.id]: false }), {})

const INITIAL_FORM = {
  name: '',
  condition: 'tea',
  description: '',
  params: defaultParams('tea'),
}

export default function ConversionProfilesPage() {
  const { profiles, saveProfile, deleteProfile } = useLibrary()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [form, setForm]                 = useState(INITIAL_FORM)
  const [expandedId, setExpandedId]     = useState(null)

  // ── Modal handlers ─────────────────────────────────────────
  const openModal = () => {
    setForm(INITIAL_FORM)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleConditionChange = (condition) => {
    setForm(f => ({ ...f, condition, params: defaultParams(condition) }))
  }

  const toggleParam = (id) => {
    setForm(f => ({ ...f, params: { ...f.params, [id]: !f.params[id] } }))
  }

  const handleCreate = () => {
    if (!form.name.trim()) return
    saveProfile(form.name.trim(), form.condition, form.params, form.description.trim())
    closeModal()
  }

  // ── Existing profile actions ────────────────────────────────
  const handleUseProfile = (profile) => {
    navigate('/conversor', { state: { presetProfile: profile } })
  }

  const handleDelete = (id) => {
    if (window.confirm('Deletar este perfil de conversão?')) deleteProfile(id)
  }

  return (
    <div className="profiles-page animate-fade-in">
      <div className="profiles-header">
        <div>
          <h1 className="profiles-title">Perfis de Conversão</h1>
          <p className="profiles-subtitle">
            Seus presets de configuração salvos para uso rápido no Conversor.
          </p>
        </div>
        <button className="btn-primary" onClick={openModal}>
          <Plus size={16} /> Novo Perfil
        </button>
      </div>

      {profiles.length > 0 ? (
        <div className="profiles-grid">
          {profiles.map(profile => {
            const info = CONDITION_INFO[profile.condition] || { label: profile.condition, icon: Settings2, color: 'var(--color-primary)' }
            const activeParamsCount = Object.values(profile.params).filter(Boolean).length
            const isExpanded = expandedId === profile.id

            return (
              <div key={profile.id} className="profile-card">
                <div className="profile-card-top" style={{ borderTopColor: info.color }}>
                  <div className="profile-icon" style={{ background: `color-mix(in srgb, ${info.color} 15%, white)`, color: info.color }}>
                    <info.icon size={20} />
                  </div>
                  <div className="profile-info">
                    <h3 className="profile-name">{profile.name}</h3>
                    <p className="profile-cond">Condição: {info.label}</p>
                  </div>
                </div>

                <div className="profile-card-body">
                  {/* Descrição comportamental */}
                  {profile.description && (
                    <div className="profile-description">
                      <FileText size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                      <p>{profile.description}</p>
                    </div>
                  )}

                  <span className="params-count">
                    {activeParamsCount} parâmetro{activeParamsCount !== 1 && 's'} ativo{activeParamsCount !== 1 && 's'}
                  </span>
                  <div className="params-preview">
                    {Object.entries(profile.params)
                      .filter(([_, isActive]) => isActive)
                      .slice(0, isExpanded ? 99 : 3)
                      .map(([key]) => (
                        <span key={key} className="param-tag">✓ {key}</span>
                      ))}
                    {!isExpanded && activeParamsCount > 3 && (
                      <button
                        className="param-tag param-expand"
                        onClick={() => setExpandedId(profile.id)}
                      >
                        +{activeParamsCount - 3} <ChevronDown size={11} />
                      </button>
                    )}
                    {isExpanded && (
                      <button
                        className="param-tag param-expand"
                        onClick={() => setExpandedId(null)}
                      >
                        Recolher <ChevronUp size={11} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="profile-card-actions">
                  <button className="btn-icon delete" onClick={() => handleDelete(profile.id)}>
                    <Trash2 size={16} />
                  </button>
                  <button
                    className="btn-use-profile"
                    style={{ '--btn-c': info.color }}
                    onClick={() => handleUseProfile(profile)}
                  >
                    Usar Perfil <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="profiles-empty">
          <Bookmark size={48} className="empty-icon" />
          <h2 className="empty-title">Nenhum perfil salvo</h2>
          <p className="empty-subtitle">
            Crie um perfil personalizado clicando em "Novo Perfil" ou configure parâmetros no Conversor e salve de lá.
          </p>
          <button className="btn-primary" onClick={openModal}>
            <Plus size={16} /> Criar primeiro perfil
          </button>
        </div>
      )}

      {/* ── MODAL: Novo Perfil ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content new-profile-modal" onClick={e => e.stopPropagation()}>
            {/* Cabeçalho */}
            <div className="new-profile-modal-header">
              <h2 className="modal-title">Novo Perfil de Conversão</h2>
              <button className="btn-icon" onClick={closeModal}><X size={20} /></button>
            </div>

            <div className="modal-form">
              {/* Nome */}
              <div className="form-group">
                <label>Nome do Perfil <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Ex: TEA - Ensino Fundamental"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Condição */}
              <div className="form-group">
                <label>Tipo de Neurodivergência</label>
                <div className="condition-picker">
                  {Object.entries(CONDITION_INFO).map(([id, info]) => {
                    const Icon = info.icon
                    const isActive = form.condition === id
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`condition-chip ${isActive ? 'active' : ''}`}
                        style={isActive ? { '--chip-c': info.color } : {}}
                        onClick={() => handleConditionChange(id)}
                      >
                        <Icon size={14} /> {info.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Parâmetros */}
              <div className="form-group">
                <label>Parâmetros de Adaptação</label>
                <div className="params-checklist">
                  {(ALL_PARAMS[form.condition] || []).map(p => (
                    <label key={p.id} className="param-check-item">
                      <input
                        type="checkbox"
                        checked={!!form.params[p.id]}
                        onChange={() => toggleParam(p.id)}
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Descrição comportamental */}
              <div className="form-group">
                <label>Descrição do Perfil Comportamental</label>
                <textarea
                  placeholder="Descreva as necessidades, comportamentos e características do aluno para quem este perfil é destinado. Ex: Aluno com TEA nível 1, boa capacidade de leitura mas dificuldade com linguagem metafórica e textos longos..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancelar</button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreate}
                  disabled={!form.name.trim()}
                >
                  <Plus size={16} /> Criar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import {
  Brain,
  BookOpen,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Accessibility,
  EyeOff
} from 'lucide-react'
import './StudentOnboardingPage.css'

const STEPS = [
  {
    id: 'condition',
    title: 'Acessibilidade Primária',
    subtitle: 'Selecione a opção que melhor se alinha com as suas necessidades cognitivas ou visuais.',
  },
  {
    id: 'font',
    title: 'Legibilidade e Leitura',
    subtitle: 'Algumas pessoas leem melhor com tipografias específicas para dislexia.',
  },
  {
    id: 'animations',
    title: 'Estímulos Visuais',
    subtitle: 'Reduzir animações e efeitos de movimento ajuda a evitar distrações ou fadiga visual.',
  },
  {
    id: 'lowStim',
    title: 'Foco e Concentração',
    subtitle: 'Uma interface limpa oculta decorações e cores intensas no plano de fundo.',
  },
  {
    id: 'colorFilter',
    title: 'Filtros de Cores',
    subtitle: 'Ajuste as cores da tela se tiver alguma dificuldade de diferenciação cromática.',
  }
]

export default function StudentOnboardingPage() {
  const { user, updateUser } = useAuth()
  const { updateMultiplePreferences } = usePreferences()
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState({
    condition: user?.condition || 'none',
    dyslexicFont: false,
    reducedAnimations: false,
    lowStimulation: false,
    colorFilter: 'none',
  })

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100

  const handleSelectCondition = (condition) => {
    setAnswers(prev => {
      // Auto-preencher sugestões inteligentes baseado na condição
      let dyslexicFont = prev.dyslexicFont
      let reducedAnimations = prev.reducedAnimations
      let lowStimulation = prev.lowStimulation
      let colorFilter = prev.colorFilter

      if (condition === 'tea') {
        reducedAnimations = true
        lowStimulation = true
      } else if (condition === 'dyslexia') {
        dyslexicFont = true
      } else if (condition === 'adhd') {
        reducedAnimations = true
        lowStimulation = true
      } else if (condition === 'color_blind') {
        colorFilter = 'high-contrast'
      }

      return {
        ...prev,
        condition,
        dyslexicFont,
        reducedAnimations,
        lowStimulation,
        colorFilter
      }
    })
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFinish = async () => {
    setError('')
    setLoading(true)
    // 1. Atualizar preferências visuais/de sistema no hook
    updateMultiplePreferences({
      theme: answers.colorFilter === 'high-contrast' ? 'high-contrast' : 'light',
      dyslexicFont: answers.dyslexicFont,
      reducedAnimations: answers.reducedAnimations,
      lowStimulation: answers.lowStimulation,
      colorFilter: answers.colorFilter,
    })

    // 2. Salvar estado de onboarded do aluno e aguardar a conclusão
    const result = await updateUser({
      condition: answers.condition !== 'none' ? answers.condition : null,
      onboarded: true
    })

    setLoading(false)

    if (result && result.success) {
      // 3. Redirecionar para o dashboard
      navigate('/dashboard')
    } else {
      setError(result?.error || 'Erro ao salvar configurações de onboarding.')
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <img src="/icone.webp" alt="Adapta Ícone" className="onboarding-logo-icon" />
            <span className="onboarding-logo-text">ADAPTA</span>
          </div>
          <div className="onboarding-progress-container">
            <span className="onboarding-step-indicator">
              Etapa {currentStep + 1} de {STEPS.length}
            </span>
            <div className="onboarding-progress-bar">
              <div
                className="onboarding-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="onboarding-content">
          <h1 className="onboarding-title">{STEPS[currentStep].title}</h1>
          <p className="onboarding-subtitle">{STEPS[currentStep].subtitle}</p>

          {/* STEP 1: CONDIÇÃO */}
          {currentStep === 0 && (
            <div className="onboarding-options-grid">
              {[
                { id: 'tea', label: 'TEA', desc: 'Transtorno do Espectro Autista', icon: Brain, color: 'var(--color-tea)' },
                { id: 'dyslexia', label: 'Dislexia', desc: 'Dificuldade com leitura e escrita', icon: BookOpen, color: 'var(--color-dyslexia)' },
                { id: 'adhd', label: 'TDAH', desc: 'Déficit de Atenção e Foco', icon: Zap, color: 'var(--color-adhd)' },
                { id: 'color_blind', label: 'Daltonismo / Visão', desc: 'Necessidades de contraste/cores', icon: Eye, color: 'var(--color-color-blind)' },
                { id: 'none', label: 'Nenhuma', desc: 'Prefiro configurar manualmente', icon: EyeOff, color: 'var(--color-text-muted)' },
              ].map(opt => {
                const Icon = opt.icon
                const isSelected = answers.condition === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`onboarding-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectCondition(opt.id)}
                    style={isSelected ? { borderColor: opt.color, '--hover-border-color': opt.color } : {}}
                  >
                    <div className="option-icon-container" style={{ background: isSelected ? opt.color : 'var(--color-bg-secondary)', color: isSelected ? '#ffffff' : 'var(--color-text)' }}>
                      <Icon size={24} />
                    </div>
                    <div className="option-text-container">
                      <span className="option-label">{opt.label}</span>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                    {isSelected && <Check size={18} className="option-checked-badge" style={{ color: opt.color }} />}
                  </button>
                )
              })}
            </div>
          )}

          {/* STEP 2: LEITURA / FONTE */}
          {currentStep === 1 && (
            <div className="onboarding-yes-no-container">
              <div className="preview-box font-preview">
                <p className="preview-label">Visualização da Fonte:</p>
                <div className={`preview-text-card ${answers.dyslexicFont ? 'font-dyslexic' : ''}`}>
                  "Este é um exemplo de texto adaptado para leitura fácil na plataforma Adapta."
                </div>
              </div>
              <div className="onboarding-choice-buttons">
                <button
                  type="button"
                  className={`choice-button ${answers.dyslexicFont === true ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, dyslexicFont: true }))}
                >
                  <Check size={20} /> Sim, usar fonte de leitura fácil
                </button>
                <button
                  type="button"
                  className={`choice-button ${answers.dyslexicFont === false ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, dyslexicFont: false }))}
                >
                  Não, manter fonte padrão
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ANIMAÇÕES */}
          {currentStep === 2 && (
            <div className="onboarding-yes-no-container">
              <div className="preview-box anim-preview">
                <p className="preview-label">Visualização do Movimento:</p>
                <div className="preview-animation-card">
                  <div className={`preview-pulse-ball ${answers.reducedAnimations ? 'paused' : ''}`} />
                  <span className="preview-pulse-text">
                    {answers.reducedAnimations ? 'Animações pausadas' : 'Efeito de movimento ativo'}
                  </span>
                </div>
              </div>
              <div className="onboarding-choice-buttons">
                <button
                  type="button"
                  className={`choice-button ${answers.reducedAnimations === true ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, reducedAnimations: true }))}
                >
                  <Check size={20} /> Sim, pausar animações e efeitos
                </button>
                <button
                  type="button"
                  className={`choice-button ${answers.reducedAnimations === false ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, reducedAnimations: false }))}
                >
                  Não, manter animações e transições
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ESTÍMULOS / FOCO */}
          {currentStep === 3 && (
            <div className="onboarding-yes-no-container">
              <div className="preview-box stimulation-preview">
                <p className="preview-label">Estilo da Interface:</p>
                <div className={`preview-layout-card ${answers.lowStimulation ? 'low-stim-preview' : ''}`}>
                  {!answers.lowStimulation && <div className="decorative-blob" />}
                  <div className="content-simulated-box">
                    <strong>Conteúdo Principal Focado</strong>
                    <span>Elementos decorativos de fundo {!answers.lowStimulation ? 'ativos' : 'ocultados'}.</span>
                  </div>
                </div>
              </div>
              <div className="onboarding-choice-buttons">
                <button
                  type="button"
                  className={`choice-button ${answers.lowStimulation === true ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, lowStimulation: true }))}
                >
                  <Check size={20} /> Sim, ocultar elementos extras (Limpeza visual)
                </button>
                <button
                  type="button"
                  className={`choice-button ${answers.lowStimulation === false ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, lowStimulation: false }))}
                >
                  Não, manter layout completo
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FILTROS DE COR */}
          {currentStep === 4 && (
            <div className="onboarding-options-grid">
              {[
                { id: 'none', label: 'Sem Filtro', desc: 'Padrão cromático normal', color: 'var(--color-primary)' },
                { id: 'high-contrast', label: 'Alto Contraste', desc: 'Maximiza visibilidade e leitura', color: '#f5c800' },
                { id: 'protanopia', label: 'Protanopia', desc: 'Filtro para deficiência no vermelho', color: '#ff6b6b' },
                { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Filtro para deficiência no verde', color: '#51cf66' },
                { id: 'tritanopia', label: 'Tritanopia', desc: 'Filtro para deficiência no azul', color: '#339af0' },
              ].map(opt => {
                const isSelected = answers.colorFilter === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`onboarding-option-card filter-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setAnswers(prev => ({ ...prev, colorFilter: opt.id }))}
                    style={isSelected ? { borderColor: opt.color, '--hover-border-color': opt.color } : {}}
                  >
                    <div className="filter-color-badge" style={{ background: opt.color }} />
                    <div className="option-text-container">
                      <span className="option-label">{opt.label}</span>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                    {isSelected && <Check size={18} className="option-checked-badge" style={{ color: opt.color }} />}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="form-error" role="alert" style={{ margin: 'var(--space-4) var(--space-8) 0 var(--space-8)' }}>
            <AlertCircle size={14} /><span>{error}</span>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="onboarding-footer">
          <button
            type="button"
            className="onboarding-btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
          >
            <ChevronLeft size={16} /> Voltar
          </button>

          <button
            type="button"
            className="onboarding-btn-primary"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : currentStep === STEPS.length - 1 ? (
              <>Concluir <Sparkles size={16} style={{ marginLeft: 'var(--space-2)' }} /></>
            ) : (
              <>Avançar <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

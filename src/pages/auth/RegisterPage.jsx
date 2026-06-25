import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Brain, Mail, Lock, User, ChevronRight, CheckCircle2, AlertCircle, GraduationCap, BookOpen } from 'lucide-react'
import './Auth.css'

const CONDITIONS = [
  { value: 'tea',         label: 'TEA',         desc: 'Transtorno do Espectro Autista', color: 'var(--color-tea)' },
  { value: 'dyslexia',   label: 'Dislexia',     desc: 'Dificuldade de leitura e escrita', color: 'var(--color-dyslexia)' },
  { value: 'adhd',       label: 'TDAH',         desc: 'Transtorno de Déficit de Atenção', color: 'var(--color-adhd)' },
  { value: 'color_blind',label: 'Daltonismo',   desc: 'Deficiência na percepção de cores', color: 'var(--color-color-blind)' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: dados, 2: perfil
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    profile: '',    // 'teacher' | 'student'
    condition: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleProfileSelect(profile) {
    setForm(f => ({ ...f, profile, condition: '' }))
    setError('')
  }

  function handleConditionSelect(condition) {
    setForm(f => ({ ...f, condition: f.condition === condition ? '' : condition }))
  }

  function handleStep1(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setError('Preencha todos os campos. A senha deve ter pelo menos 6 caracteres.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      setError('Por favor, insira um e-mail válido (exemplo: usuario@dominio.com).')
      return
    }
    setError('')
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.profile) {
      setError('Selecione um perfil para continuar.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    try {
      // Cadastro tradicional
      await register(form)
      setLoading(false)
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      let msg = 'Erro ao criar conta.'
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está cadastrado. Tente entrar na sua conta!'
      } else if (err.code === 'auth/invalid-email') {
        msg = 'O formato do e-mail inserido é inválido.'
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha deve ter pelo menos 6 caracteres.'
      } else if (err.message) {
        // Fallback para outros erros contendo código firebase ou mensagem limpa
        msg = err.message.replace('Firebase:', '').trim()
      }
      setError(msg)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
        <div className="auth-blob blob-3" />
      </div>

      <div className="auth-card auth-card-wide animate-fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/icone.webp" alt="Adapta Ícone" className="custom-logo-icon" />
          <img src="/nome.webp" alt="Adapta" className="custom-logo-text" style={{ height: '32px' }} />
        </div>

        {/* Steps indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'done' : ''}`}>
            <div className="step-dot">{step > 1 ? <CheckCircle2 size={14} /> : '1'}</div>
            <span>Dados</span>
          </div>
          <div className="step-line" />
          <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-dot">2</div>
            <span>Perfil</span>
          </div>
        </div>

        {/* Step 1: Dados básicos */}
        {step === 1 && (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Crie sua conta</h1>
              <p className="auth-subtitle">Comece gratuitamente — sem cartão de crédito</p>
            </div>

            <form className="auth-form" onSubmit={handleStep1} noValidate>
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Nome completo</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input id="reg-name" name="name" type="text" className="form-input"
                    placeholder="Seu nome" value={form.name} onChange={handleChange} autoComplete="name" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">E-mail</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input id="reg-email" name="email" type="email" className="form-input"
                    placeholder="seu@email.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">Senha</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input id="reg-password" name="password" type="password" className="form-input"
                    placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} autoComplete="new-password" />
                </div>
              </div>

              {error && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} /><span>{error}</span>
                </div>
              )}

              <button id="reg-next" type="submit" className="btn-primary btn-full">
                Continuar <ChevronRight size={16} />
              </button>
            </form>
          </>
        )}

        {/* Step 2: Seleção de perfil */}
        {step === 2 && (
          <>
            <div className="auth-header">
              <h1 className="auth-title">Qual é o seu perfil?</h1>
              <p className="auth-subtitle">Isso define quais funcionalidades você terá acesso</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* Perfil cards */}
              <div className="profile-cards">
                {[
                  {
                    value: 'teacher',
                    label: 'Professor',
                    icon: GraduationCap,
                    desc: 'Acesse cursos, converta materiais e gerencie turmas.',
                  },
                  {
                    value: 'student',
                    label: 'Aluno',
                    icon: BookOpen,
                    desc: 'Veja materiais adaptados compartilhados pelo professor.',
                  },
                ].map(p => {
                  const Icon = p.icon
                  return (
                    <button
                      key={p.value}
                      type="button"
                      id={`profile-${p.value}`}
                      className={`profile-card${form.profile === p.value ? ' selected' : ''}`}
                      onClick={() => handleProfileSelect(p.value)}
                    >
                      <span className="profile-card-emoji" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>
                        <Icon size={28} />
                      </span>
                      <span className="profile-card-label">{p.label}</span>
                      <span className="profile-card-desc">{p.desc}</span>
                      {form.profile === p.value && (
                        <CheckCircle2 size={18} className="profile-card-check" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Condição neurodivergente (opcional, só para Aluno) */}
              {form.profile === 'student' && (
                <div className="condition-section">
                  <p className="condition-title">Condição neurodivergente (opcional)</p>
                  <p className="condition-hint">Seus materiais serão exibidos adaptados automaticamente.</p>
                  <div className="condition-grid">
                    {CONDITIONS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        id={`condition-${c.value}`}
                        className={`condition-chip${form.condition === c.value ? ' selected' : ''}`}
                        style={{ '--chip-color': c.color }}
                        onClick={() => handleConditionSelect(c.value)}
                      >
                        <span className="condition-chip-label">{c.label}</span>
                        <span className="condition-chip-desc">{c.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="form-error" role="alert">
                  <AlertCircle size={14} /><span>{error}</span>
                </div>
              )}



              <div className="auth-form-row">
                <button type="button" className="btn-ghost" onClick={() => setStep(1)}>
                  Voltar
                </button>
                <button id="reg-submit" type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <span className="spinner" /> : 'Criar conta'}
                </button>
              </div>
            </form>
          </>
        )}

        <p className="auth-switch">
          Já tem conta? <Link to="/login" id="go-to-login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

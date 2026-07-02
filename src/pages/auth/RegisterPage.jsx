import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Brain, Mail, Lock, User, ChevronRight, CheckCircle2, AlertCircle, GraduationCap, BookOpen } from 'lucide-react'
import { auth, googleProvider } from '../../services/firebase'
import { signInWithPopup } from 'firebase/auth'
import './Auth.css'

const CONDITIONS = [
  { value: 'tea',         label: 'TEA',         desc: 'Transtorno do Espectro Autista', color: 'var(--color-tea)' },
  { value: 'dyslexia',   label: 'Dislexia',     desc: 'Dificuldade de leitura e escrita', color: 'var(--color-dyslexia)' },
  { value: 'adhd',       label: 'TDAH',         desc: 'Transtorno de Déficit de Atenção', color: 'var(--color-adhd)' },
  { value: 'color_blind',label: 'Daltonismo',   desc: 'Deficiência na percepção de cores', color: 'var(--color-color-blind)' },
]

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: dados, 2: perfil
  const [googleUser, setGoogleUser] = useState(null)
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

  async function handleGoogleSignUp() {
    setLoading(true)
    setError('')
    try {
      const userCredential = await signInWithPopup(auth, googleProvider)
      setGoogleUser(userCredential.user)
      setError('')
      setStep(2)
    } catch (err) {
      console.error(err)
      setError('Falha no cadastro com Google ou popup fechado.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.profile) {
      setError('Selecione um perfil para continuar.')
      return
    }
    setLoading(true)
    try {
      if (googleUser) {
        // Cadastro via Google (completa o perfil)
        const result = await loginWithGoogle({
          profile: form.profile,
          condition: form.condition
        })
        setLoading(false)
        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.error)
        }
      } else {
        // Cadastro tradicional
        const result = await register({
          name: form.name,
          email: form.email,
          password: form.password,
          profile: form.profile,
          condition: form.condition
        })
        setLoading(false)
        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      setLoading(false)
      setError('Erro ao criar conta.')
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

            <div className="auth-divider">ou</div>

            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Cadastrar com o Google
            </button>
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

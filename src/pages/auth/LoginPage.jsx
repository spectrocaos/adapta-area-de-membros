import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Brain, Mail, Lock, AlertCircle } from 'lucide-react'
import './Auth.css'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    const result = await login(form)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    const result = await loginWithGoogle()
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
        <div className="auth-blob blob-3" />
      </div>

      <div className="auth-card animate-fade-in">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/icone.webp" alt="Adapta Ícone" className="custom-logo-icon" />
          <img src="/nome.webp" alt="Adapta" className="custom-logo-text" style={{ height: '32px' }} />
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-subtitle">Entre na sua conta para continuar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* E-mail */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">E-mail</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Senha</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="login-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="form-error" role="alert">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>

        <div className="auth-divider">ou</div>

        <button
          type="button"
          className="btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Entrar com o Google
        </button>

        <p className="auth-switch">
          Não tem conta?{' '}
          <Link to="/cadastro" id="go-to-register">Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  )
}

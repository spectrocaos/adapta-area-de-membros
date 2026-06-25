import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Brain, Mail, Lock, AlertCircle } from 'lucide-react'
import './Auth.css'

export default function LoginPage() {
  const { login } = useAuth()
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
    await new Promise(r => setTimeout(r, 600)) // UX feedback
    const result = await login(form)
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

        <p className="auth-switch">
          Não tem conta?{' '}
          <Link to="/cadastro" id="go-to-register">Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  )
}

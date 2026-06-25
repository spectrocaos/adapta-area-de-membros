import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // Carregar usuário e token do localStorage
    const savedUser = localStorage.getItem('adapta_user')
    const token = localStorage.getItem('adapta_token')
    
    if (savedUser && token && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        logout()
      }
    } else {
      logout() // Limpa os dados se faltar algum
    }
    setLoading(false)
  }, [])

  async function register({ name, email, password, profile, condition }) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, profile, condition })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adapta_user', JSON.stringify(data.user))
        localStorage.setItem('adapta_token', data.token)
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.message || 'Erro ao registrar.' }
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão com o servidor.' }
    }
  }

  async function login({ email, password }) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adapta_user', JSON.stringify(data.user))
        localStorage.setItem('adapta_token', data.token)
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.message || 'E-mail ou senha inválidos.' }
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão com o servidor.' }
    }
  }

  async function logout() {
    localStorage.removeItem('adapta_user')
    localStorage.removeItem('adapta_token')
    setUser(null)
  }

  async function updateUser(updates) {
    if (!user?.id) return
    
    const token = localStorage.getItem('adapta_token')
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adapta_user', JSON.stringify(data.user))
        setUser(data.user)
      } else {
        console.error('Erro ao atualizar usuário:', data.message)
      }
    } catch (error) {
      console.error('Erro de conexão ao atualizar usuário:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, register, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

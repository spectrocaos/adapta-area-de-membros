import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'

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

  // Função auxiliar para sincronizar o usuário com o banco de dados PostgreSQL
  async function syncUserWithBackend({ uid, email, displayName, photoURL, profile, condition }) {
    try {
      const response = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          email,
          name: displayName || email.split('@')[0],
          profile: profile || 'student',
          condition: condition || null,
          photoUrl: photoURL || null
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adapta_user', JSON.stringify(data.user))
        localStorage.setItem('adapta_token', data.token)
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.message || 'Erro ao sincronizar com banco de dados.' }
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão com o servidor de sincronização.' }
    }
  }

  async function register({ name, email, password, profile, condition }) {
    try {
      // 1. Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const fbUser = userCredential.user

      // 2. Sincronizar com o banco PostgreSQL
      const result = await syncUserWithBackend({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: name,
        profile,
        condition
      })

      return result;
    } catch (error) {
      console.error("Firebase Sign Up Error: ", error)
      let errorMessage = 'Erro ao registrar no Firebase.'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido.'
      }
      return { success: false, error: errorMessage }
    }
  }

  async function login({ email, password }) {
    try {
      // 1. Fazer login no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const fbUser = userCredential.user

      // 2. Sincronizar com o banco PostgreSQL
      const result = await syncUserWithBackend({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName
      })

      return result;
    } catch (error) {
      console.error("Firebase Login Error: ", error)
      let errorMessage = 'E-mail ou senha inválidos.'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-mail ou senha inválidos.'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'E-mail inválido.'
      }
      return { success: false, error: errorMessage }
    }
  }

  async function loginWithGoogle(extraDetails = {}) {
    try {
      // 1. Fazer login com o Google Popup
      const userCredential = await signInWithPopup(auth, googleProvider)
      const fbUser = userCredential.user

      // 2. Sincronizar com o banco PostgreSQL
      const result = await syncUserWithBackend({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        profile: extraDetails.profile,
        condition: extraDetails.condition
      })

      return result;
    } catch (error) {
      console.error("Google Login Error: ", error)
      return { success: false, error: 'Falha no login com Google ou popup fechado.' }
    }
  }

  async function logout() {
    try {
      await firebaseSignOut(auth)
    } catch (err) {
      console.error("Firebase Sign Out Error: ", err)
    }
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
    <AuthContext.Provider value={{ user, isAuthenticated, register, login, loginWithGoogle, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


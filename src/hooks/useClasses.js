import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

export function useClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])

  // Sincronizar Turmas
  const loadClasses = useCallback(async () => {
    if (!user?.id) return
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const list = await response.json()
        setClasses(list)
      }
    } catch (error) {
      console.error('Erro ao carregar turmas', error)
    }
  }, [user])

  useEffect(() => {
    loadClasses()
    window.addEventListener('adapta_classes_changed', loadClasses)
    return () => {
      window.removeEventListener('adapta_classes_changed', loadClasses)
    }
  }, [loadClasses])

  // ── Operações CRUD ────────────────────────────────────────────────────────
  
  const createClass = useCallback(async (name, subject, description = '') => {
    if (!user?.id || user.profile !== 'teacher') return
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, subject, description })
      })
      if (response.ok) {
        window.dispatchEvent(new Event('adapta_classes_changed'))
      }
    } catch (error) {
      console.error('Erro ao criar turma', error)
    }
  }, [user])

  const deleteClass = useCallback(async (id) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        window.dispatchEvent(new Event('adapta_classes_changed'))
      }
    } catch (error) {
      console.error('Erro ao deletar turma', error)
    }
  }, [])

  const getClassById = useCallback((id) => {
    return classes.find(c => c.id === id)
  }, [classes])

  // ── Alunos ────────────────────────────────────────────────────────────────

  const addStudent = useCallback(async (classId, studentIdOrName, condition) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    // Fallback: se estiver usando a string name do mock (menos de 36 chars), falhará no DB real.
    // Em produção a UI enviará o studentId UUID.
    const studentId = (studentIdOrName?.length > 20) ? studentIdOrName : null
    if (!studentId) {
      console.warn('UI precisa ser atualizada para enviar studentId ao invés de name')
      return
    }

    try {
      const response = await fetch('/api/classes/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'addStudent', classId, studentId })
      })
      if (response.ok) {
        window.dispatchEvent(new Event('adapta_classes_changed'))
      }
    } catch (error) {
      console.error('Erro ao adicionar aluno', error)
    }
  }, [])

  const removeStudent = useCallback(async (classId, studentId) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch('/api/classes/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'removeStudent', classId, studentId })
      })
      if (response.ok) {
        window.dispatchEvent(new Event('adapta_classes_changed'))
      }
    } catch (error) {
      console.error('Erro ao remover aluno', error)
    }
  }, [])

  // ── Compartilhamento ──────────────────────────────────────────────────────

  const shareMaterial = useCallback(async (classId, materialId) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return
    try {
      const response = await fetch('/api/classes/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'shareMaterial', classId, materialId })
      })
      if (response.ok) window.dispatchEvent(new Event('adapta_classes_changed'))
    } catch (error) { console.error(error) }
  }, [])

  const unshareMaterial = useCallback(async (classId, materialId) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return
    try {
      const response = await fetch('/api/classes/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'unshareMaterial', classId, materialId })
      })
      if (response.ok) window.dispatchEvent(new Event('adapta_classes_changed'))
    } catch (error) { console.error(error) }
  }, [])

  const shareMaterialWithStudent = useCallback(async (classId, studentId, materialId) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return
    try {
      const response = await fetch('/api/classes/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'shareStudentMaterial', classId, studentId, materialId })
      })
      if (response.ok) window.dispatchEvent(new Event('adapta_classes_changed'))
    } catch (error) { console.error(error) }
  }, [])

  const unshareMaterialWithStudent = useCallback(async (classId, studentId, materialId) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return
    try {
      const response = await fetch('/api/classes/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'unshareStudentMaterial', classId, studentId, materialId })
      })
      if (response.ok) window.dispatchEvent(new Event('adapta_classes_changed'))
    } catch (error) { console.error(error) }
  }, [])

  return {
    classes,
    createClass,
    deleteClass,
    getClassById,
    addStudent,
    removeStudent,
    shareMaterial,
    unshareMaterial,
    shareMaterialWithStudent,
    unshareMaterialWithStudent
  }
}

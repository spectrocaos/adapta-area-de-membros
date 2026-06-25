import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

export function useLibrary() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState([])
  const [profiles, setProfiles] = useState([])

  // Sincronizar Materiais
  const loadMaterials = useCallback(async () => {
    if (!user?.id) return
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch('/api/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        let list = await response.json()
        list = list.map(m => ({ ...m, adapted: m.content || m.adapted }))
        setMaterials(list)
      }
    } catch (error) {
      console.error('Erro ao carregar materiais', error)
    }
  }, [user])

  useEffect(() => {
    loadMaterials()
    window.addEventListener('adapta_materials_changed', loadMaterials)
    return () => {
      window.removeEventListener('adapta_materials_changed', loadMaterials)
    }
  }, [loadMaterials])

  // Sincronizar Perfis de Conversão (apenas para Professor)
  useEffect(() => {
    if (!user?.id || user.profile !== 'teacher') return

    const loadProfiles = () => {
      const stored = localStorage.getItem('adapta_profiles')
      let list = stored ? JSON.parse(stored) : []
      
      list = list.filter(p => p.createdBy === user.id)
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setProfiles(list)
    }

    loadProfiles()
    window.addEventListener('storage', loadProfiles)
    window.addEventListener('adapta_profiles_changed', loadProfiles)

    return () => {
      window.removeEventListener('storage', loadProfiles)
      window.removeEventListener('adapta_profiles_changed', loadProfiles)
    }
  }, [user])

  // ── Salvar/Deletar Materiais ──────────────────────────────────────────────
  
  const saveMaterial = useCallback(async (materialData) => {
    if (!user?.id) return
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(materialData)
      })
      if (response.ok) {
        window.dispatchEvent(new Event('adapta_materials_changed'))
      }
    } catch (error) {
      console.error('Erro ao salvar material', error)
    }
  }, [user])

  const deleteMaterial = useCallback(async (id) => {
    const token = localStorage.getItem('adapta_token')
    if (!token) return

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        window.dispatchEvent(new Event('adapta_materials_changed'))
      }
    } catch (error) {
      console.error('Erro ao deletar material', error)
    }
  }, [])

  // ── Salvar/Deletar Perfis de Conversão ────────────────────────────────────

  const saveProfile = useCallback(async (name, condition, params, description = '') => {
    if (!user?.id) return
    const newProfile = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      name,
      condition,
      params,
      description
    }
    
    const stored = localStorage.getItem('adapta_profiles')
    const list = stored ? JSON.parse(stored) : []
    list.push(newProfile)
    
    localStorage.setItem('adapta_profiles', JSON.stringify(list))
    window.dispatchEvent(new Event('adapta_profiles_changed'))
  }, [user])

  const deleteProfile = useCallback(async (id) => {
    const stored = localStorage.getItem('adapta_profiles')
    if (!stored) return
    let list = JSON.parse(stored)
    list = list.filter(p => p.id !== id)
    localStorage.setItem('adapta_profiles', JSON.stringify(list))
    window.dispatchEvent(new Event('adapta_profiles_changed'))
  }, [])

  return {
    materials,
    saveMaterial,
    deleteMaterial,
    profiles,
    saveProfile,
    deleteProfile
  }
}

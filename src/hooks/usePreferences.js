import { useState, useEffect } from 'react'

const PREFS_KEY = 'adapta_preferences'

const defaultPreferences = {
  theme: 'light', // 'light' | 'dark' | 'high-contrast'
  fontSize: 'normal', // 'normal' | 'large' | 'extra-large'
  spacing: 'normal', // 'normal' | 'wide'
  lowStimulation: false, // boolean
  dyslexicFont: false, // boolean
  reducedAnimations: false, // boolean
  colorFilter: 'none' // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast'
}

export function usePreferences() {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY)
      return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences
    } catch {
      return defaultPreferences
    }
  })

  // Aplica as preferências no body sempre que mudarem
  useEffect(() => {
    const { theme, fontSize, spacing, lowStimulation, dyslexicFont, reducedAnimations, colorFilter } = preferences
    
    // Reseta classes do body
    document.body.className = ''
    
    // Aplica tema
    if (theme === 'dark') document.body.classList.add('theme-dark')
    if (theme === 'high-contrast') document.body.classList.add('theme-high-contrast')
    
    // Aplica fonte
    if (fontSize === 'large') document.body.classList.add('font-large')
    if (fontSize === 'extra-large') document.body.classList.add('font-extra-large')
    
    // Aplica espaçamento
    if (spacing === 'wide') document.body.classList.add('spacing-wide')

    // Modo baixa estimulação
    if (lowStimulation) document.body.classList.add('low-stim')

    // Novas preferências
    if (dyslexicFont) document.body.classList.add('font-dyslexic')
    if (reducedAnimations) document.body.classList.add('reduced-animations')
    if (colorFilter && colorFilter !== 'none') {
      document.body.classList.add(`filter-${colorFilter}`)
    }

    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences))
  }, [preferences])

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const updateMultiplePreferences = (updates) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  return { preferences, updatePreference, updateMultiplePreferences }
}

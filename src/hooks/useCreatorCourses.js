import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

const SEED_DATA = [
  {
    id: 'seed-curso-1',
    createdAt: new Date().toISOString(),
    teacherId: 'all', // Aparece para todos no mock
    title: 'História Inclusiva - O Brasil Colônia',
    description: 'Curso adaptado sobre o Brasil Colonial, com foco em inclusão.',
    classId: 'mock-class-1',
    profileId: 'tea', // Perfil de adaptação padrão: TEA
    modules: [
      {
        id: 'mod-1',
        title: 'Módulo 1 - Descobrimento',
        lessons: [
          { 
            id: 'less-1', 
            title: 'O Dia do Indígena', 
            type: 'video', 
            duration: '5 min',
            description: 'Nesta aula sobre o Dia do Indígena, aprenderemos sobre a importância da cultura nativa, com foco na acessibilidade e respeito aos povos originários.',
            activities: [
              { id: 'act-1', type: 'audio', title: '🎧 Escuta', content: 'Áudio narrado com pausas longas sobre a cultura indígena.' },
              { id: 'act-2', type: 'complete', title: '⬜ Complete', content: 'Arraste as imagens (ocar, arco, tribo) para preencher as lacunas.' },
              { id: 'act-3', type: 'order', title: '🔀 Ordene', content: 'Ordene a sequência da rotina em uma aldeia indígena.' },
              { id: 'act-4', type: 'draw', title: '✏️ Desenhe', content: 'Desenhe uma aldeia ou um costume indígena.' },
              { id: 'act-5', type: 'print', title: '📄 No papel', content: 'Atividade de ligar os pontos com símbolos indígenas para ser impressa.' }
            ]
          },
          { 
            id: 'less-2', 
            title: 'A Chegada dos Portugueses ao Brasil', 
            type: 'audio', 
            duration: '3 min',
            description: 'Nesta aula, abordaremos a chegada das caravelas ao Brasil, explorando como foi o primeiro contato visual e histórico, de forma simplificada.',
            activities: [
              { id: 'act-1', type: 'audio', title: '🎧 Escuta', content: 'Áudio sobre a viagem de Pedro Álvares Cabral.' },
              { id: 'act-2', type: 'complete', title: '⬜ Complete', content: 'Arraste as palavras e imagens corretas do mapa e caravelas.' },
              { id: 'act-3', type: 'order', title: '🔀 Ordene', content: 'Ordene a sequência das caravelas saindo de Portugal até chegarem ao litoral brasileiro.' },
              { id: 'act-4', type: 'draw', title: '✏️ Desenhe', content: 'Desenhe como você imagina o primeiro encontro na praia.' },
              { id: 'act-5', type: 'print', title: '📄 No papel', content: 'Atividade de colorir uma caravela portuguesa.' }
            ]
          }
        ]
      }
    ]
  }
]

export function useCreatorCourses() {
  const { user } = useAuth()
  const [creatorCourses, setCreatorCourses] = useState(() => {
    // Inicialização síncrona para evitar 'flicker' e falsos 'não encontrado'
    if (!user?.id) return []
    const stored = localStorage.getItem('adapta_creator_courses')
    let list = stored ? JSON.parse(stored) : []
    
    // Sempre garante que o curso semente exista e esteja atualizado
    const seedIndex = list.findIndex(c => c.id === 'seed-curso-1')
    const freshSeed = { ...SEED_DATA[0], teacherId: user.id }
    if (seedIndex >= 0) {
      list[seedIndex] = freshSeed
    } else {
      list.push(freshSeed)
    }
    
    // Filtra pelos cursos criados pelo professor atual
    if (user.profile === 'teacher') {
      list = list.filter(c => c.teacherId === user.id || c.teacherId === 'all')
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return list
  })

  // Carregar cursos (para manter sincronia)
  useEffect(() => {
    if (!user?.id) return

    const loadCourses = () => {
      const stored = localStorage.getItem('adapta_creator_courses')
      let list = stored ? JSON.parse(stored) : []

      // Sempre garante que o curso semente exista e esteja atualizado
      const seedIndex = list.findIndex(c => c.id === 'seed-curso-1')
      const freshSeed = { ...SEED_DATA[0], teacherId: user.id }
      if (seedIndex >= 0) {
        list[seedIndex] = freshSeed
      } else {
        list.push(freshSeed)
      }

      localStorage.setItem('adapta_creator_courses', JSON.stringify(list))
      
      // Filtra pelos cursos criados pelo professor atual
      if (user.profile === 'teacher') {
        list = list.filter(c => c.teacherId === user.id || c.teacherId === 'all')
      }

      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setCreatorCourses(list)
    }

    loadCourses()
    window.addEventListener('storage', loadCourses)
    window.addEventListener('adapta_creator_courses_changed', loadCourses)

    return () => {
      window.removeEventListener('storage', loadCourses)
      window.removeEventListener('adapta_creator_courses_changed', loadCourses)
    }
  }, [user])

  // Criar curso
  const createCourse = useCallback(async (title, description, classId, profileId) => {
    if (!user?.id || user.profile !== 'teacher') return
    const newCourse = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      teacherId: user.id,
      title,
      description,
      classId,
      profileId,
      modules: []
    }
    
    const stored = localStorage.getItem('adapta_creator_courses')
    const list = stored ? JSON.parse(stored) : []
    list.push(newCourse)
    
    localStorage.setItem('adapta_creator_courses', JSON.stringify(list))
    window.dispatchEvent(new Event('adapta_creator_courses_changed'))
    
    return newCourse.id
  }, [user])

  // Deletar curso
  const deleteCourse = useCallback(async (id) => {
    const stored = localStorage.getItem('adapta_creator_courses')
    if (!stored) return
    let list = JSON.parse(stored)
    list = list.filter(c => c.id !== id)
    localStorage.setItem('adapta_creator_courses', JSON.stringify(list))
    window.dispatchEvent(new Event('adapta_creator_courses_changed'))
  }, [])

  // Obter curso por ID
  const getCourseById = useCallback((id) => {
    return creatorCourses.find(c => c.id === id)
  }, [creatorCourses])

  // Adicionar Aula ao curso (rota A ou B - abstraído)
  const addLessonToCourse = useCallback((courseId, lessonData) => {
    const stored = localStorage.getItem('adapta_creator_courses')
    if (!stored) return
    let list = JSON.parse(stored)
    
    const courseIndex = list.findIndex(c => c.id === courseId)
    if (courseIndex === -1) return

    // Simplificação: Adiciona sempre no primeiro módulo ou cria um se não existir
    if (!list[courseIndex].modules || list[courseIndex].modules.length === 0) {
      list[courseIndex].modules = [{
        id: crypto.randomUUID(),
        title: 'Módulo 1',
        lessons: []
      }]
    }

    list[courseIndex].modules[0].lessons.push({
      id: crypto.randomUUID(),
      ...lessonData
    })

    localStorage.setItem('adapta_creator_courses', JSON.stringify(list))
    window.dispatchEvent(new Event('adapta_creator_courses_changed'))
  }, [])

  // Calcula progresso simplificado para o dashboard
  const getCourseStats = useCallback((course) => {
    const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0
    // Como é uma demo do professor, vamos mockar um progresso aleatório ou zerado se não tiver seed
    const percent = totalLessons > 0 ? (course.id.includes('seed') ? 45 : 0) : 0 
    return {
      total: totalLessons,
      done: Math.floor((percent / 100) * totalLessons),
      percent
    }
  }, [])

  return {
    creatorCourses,
    createCourse,
    deleteCourse,
    getCourseById,
    addLessonToCourse,
    getCourseStats
  }
}

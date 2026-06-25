import { useState, useCallback } from 'react'
import { COURSES } from '../data/courses'

const STORAGE_KEY = 'adapta_course_progress'

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useCourseProgress() {
  const [progress, setProgress] = useState(getProgress)

  const markLessonDone = useCallback((lessonId) => {
    setProgress(prev => {
      const next = { ...prev, [lessonId]: true }
      saveProgress(next)
      return next
    })
  }, [])

  const markLessonUndone = useCallback((lessonId) => {
    setProgress(prev => {
      const next = { ...prev }
      delete next[lessonId]
      saveProgress(next)
      return next
    })
  }, [])

  const isLessonDone = useCallback((lessonId) => {
    return !!progress[lessonId]
  }, [progress])

  const getCourseProgress = useCallback((courseId) => {
    const course = COURSES.find(c => c.id === courseId)
    if (!course) return { done: 0, total: 0, percent: 0 }
    const allLessons = course.modules.flatMap(m => m.lessons)
    const done = allLessons.filter(l => progress[l.id]).length
    const total = allLessons.length
    const percent = total > 0 ? Math.round((done / total) * 100) : 0
    return { done, total, percent }
  }, [progress])

  const getTrailProgress = useCallback((trailId) => {
    const trailCourses = COURSES.filter(c => c.trailId === trailId)
    const allLessons = trailCourses.flatMap(c => c.modules.flatMap(m => m.lessons))
    const done = allLessons.filter(l => progress[l.id]).length
    const total = allLessons.length
    const percent = total > 0 ? Math.round((done / total) * 100) : 0
    return { done, total, percent, courses: trailCourses.length }
  }, [progress])

  const getFirstUnfinishedLesson = useCallback((courseId) => {
    const course = COURSES.find(c => c.id === courseId)
    if (!course) return null
    const allLessons = course.modules.flatMap(m => m.lessons)
    return allLessons.find(l => !progress[l.id]) || allLessons[0]
  }, [progress])

  return {
    markLessonDone,
    markLessonUndone,
    isLessonDone,
    getCourseProgress,
    getTrailProgress,
    getFirstUnfinishedLesson,
  }
}

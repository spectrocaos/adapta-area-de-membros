import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Layout from '../components/layout/Layout'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Dashboard
import TeacherDashboard from '../pages/dashboard/TeacherDashboard'
import StudentDashboard from '../pages/dashboard/StudentDashboard'

// Courses
import CourseCatalogPage from '../pages/courses/CourseCatalogPage'
import CourseDetailPage from '../pages/courses/CourseDetailPage'
import LessonPlayerPage from '../pages/courses/LessonPlayerPage'
import MyCoursesPage from '../pages/courses/MyCoursesPage'
import CourseEditorPage from '../pages/courses/CourseEditorPage'
import LessonEditorPage from '../pages/courses/LessonEditorPage'

// Converter
import ConverterPage from '../pages/converter/ConverterPage'

// Library
import LibraryPage from '../pages/library/LibraryPage'
import ConversionProfilesPage from '../pages/library/ConversionProfilesPage'

// Classes
import ClassesPage from '../pages/classes/ClassesPage'
import ClassDetailPage from '../pages/classes/ClassDetailPage'

// Profile
import StudentProfilePage from '../pages/profile/StudentProfilePage'
import StudentMaterialsPage from '../pages/profile/StudentMaterialsPage'

// Student pages
import MyTeachersPage from '../pages/student/MyTeachersPage'
import MySubjectsPage from '../pages/student/MySubjectsPage'
import StudentOnboardingPage from '../pages/student/StudentOnboardingPage'

function ProtectedRoute({ children, requireProfile }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (requireProfile) {
    const profiles = Array.isArray(requireProfile) ? requireProfile : [requireProfile]
    if (!profiles.includes(user.profile)) {
      return <Navigate to="/dashboard" replace />
    }
  }
  return children
}

function DashboardRouter() {
  const { user } = useAuth()
  if (user?.profile === 'teacher') return <TeacherDashboard />
  return <StudentDashboard />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* Onboarding do Aluno (Tela Cheia) */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <StudentOnboardingPage />
          </ProtectedRoute>
        } />

        {/* Rotas Protegidas (dentro do Layout) */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardRouter />} />

          {/* Cursos — ambos os perfis */}
          <Route path="cursos" element={
            <ProtectedRoute requireProfile={['student', 'teacher']}>
              <CourseCatalogPage />
            </ProtectedRoute>
          } />
          <Route path="cursos/:courseId" element={
            <ProtectedRoute requireProfile={['student', 'teacher']}>
              <CourseDetailPage />
            </ProtectedRoute>
          } />
          <Route path="cursos/:courseId/aulas/:lessonId" element={
            <ProtectedRoute requireProfile={['student', 'teacher']}>
              <LessonPlayerPage />
            </ProtectedRoute>
          } />

          {/* Módulo de Criação de Cursos / Meus Cursos */}
          <Route path="meus-cursos" element={
            <ProtectedRoute requireProfile={['teacher', 'student']}>
              <MyCoursesPage />
            </ProtectedRoute>
          } />
          <Route path="meus-cursos/:courseId" element={
            <ProtectedRoute requireProfile="teacher">
              <CourseEditorPage />
            </ProtectedRoute>
          } />
          <Route path="meus-cursos/:courseId/aulas/:lessonId" element={
            <ProtectedRoute requireProfile="teacher">
              <LessonEditorPage />
            </ProtectedRoute>
          } />

          {/* Visualização de Cursos Criados (Mantém Meus Cursos ativo no menu) */}
          <Route path="meus-cursos/:courseId/view" element={
            <ProtectedRoute requireProfile={['teacher', 'student']}>
              <CourseDetailPage />
            </ProtectedRoute>
          } />
          <Route path="meus-cursos/:courseId/view/aulas/:lessonId" element={
            <ProtectedRoute requireProfile={['teacher', 'student']}>
              <LessonPlayerPage />
            </ProtectedRoute>
          } />

          {/* Conversor — apenas Professor */}
          <Route path="conversor" element={
            <ProtectedRoute requireProfile="teacher">
              <ConverterPage />
            </ProtectedRoute>
          } />

          {/* Biblioteca */}
          <Route path="biblioteca" element={
            <ProtectedRoute requireProfile="teacher">
              <LibraryPage />
            </ProtectedRoute>
          } />
          <Route path="perfis" element={
            <ProtectedRoute requireProfile="teacher">
              <ConversionProfilesPage />
            </ProtectedRoute>
          } />

          {/* Turmas — apenas Professor */}
          <Route path="turmas" element={
            <ProtectedRoute requireProfile="teacher">
              <ClassesPage />
            </ProtectedRoute>
          } />
          <Route path="turmas/:classId" element={
            <ProtectedRoute requireProfile="teacher">
              <ClassDetailPage />
            </ProtectedRoute>
          } />

          {/* Perfil Aluno */}
          <Route path="perfil" element={<StudentProfilePage />} />
          <Route path="materiais" element={
            <ProtectedRoute requireProfile="student">
              <StudentMaterialsPage />
            </ProtectedRoute>
          } />
          <Route path="meus-professores" element={
            <ProtectedRoute requireProfile="student">
              <MyTeachersPage />
            </ProtectedRoute>
          } />
          <Route path="minhas-materias" element={
            <ProtectedRoute requireProfile="student">
              <MySubjectsPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

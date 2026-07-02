import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import ReactMarkdown from 'react-markdown'
import {
  GraduationCap, FileText, ArrowLeft, BookOpen,
  FolderOpen, User, Mail, ChevronRight, Package
} from 'lucide-react'
import './StudentPagesShared.css'

function getRandomAvatarColor(name) {
  const colors = ['var(--color-tea)', 'var(--color-adhd)', 'var(--color-dyslexia)', 'var(--color-color-blind)', 'var(--color-primary)']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash % colors.length)
  return colors[index]
}

export default function MyTeachersPage() {
  const { user } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [myMaterials, setMyMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  useEffect(() => {
    async function loadTeachersAndMaterials() {
      setLoading(true)
      const token = localStorage.getItem('adapta_token')
      try {
        // 1. Carregar turmas do aluno para extrair os professores
        const classRes = await fetch('/api/classes', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (classRes.ok) {
          const classesData = await classRes.json()
          const teacherMap = {}
          classesData.forEach(c => {
            if (c.teacher) {
              teacherMap[c.teacher.id] = {
                id: c.teacher.id,
                name: c.teacher.name,
                email: c.teacher.email,
                subject: c.grade || 'Professor',
                avatarColor: getRandomAvatarColor(c.teacher.name)
              }
            }
          })
          setTeachers(Object.values(teacherMap))
        }

        // 2. Carregar materiais compartilhados com o aluno
        const matRes = await fetch('/api/student/materials', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (matRes.ok) {
          const materialsData = await matRes.json()
          setMyMaterials(materialsData)
        }
      } catch (err) {
        console.error('Erro ao buscar dados do aluno:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadTeachersAndMaterials()
  }, [])

  // ── Leitura de material ────────────────────────────────────
  if (selectedMaterial) {
    return (
      <div className="reading-view animate-fade-in">
        <div className="reading-header">
          <button className="btn-back-link" onClick={() => setSelectedMaterial(null)}>
            <ArrowLeft size={16} /> Voltar
          </button>
          <span className="reading-date">
            {new Date(selectedMaterial.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="reading-content markdown-body">
          <ReactMarkdown>{selectedMaterial.adapted}</ReactMarkdown>
        </div>
      </div>
    )
  }

  // ── Detalhes do professor ──────────────────────────────────
  if (selectedTeacher) {
    const teacherMaterials = myMaterials.filter(m => m.createdBy === selectedTeacher.id)
    return (
      <div className="student-sub-page animate-fade-in">
        <button className="btn-back-link" onClick={() => setSelectedTeacher(null)}>
          <ArrowLeft size={16} /> Voltar aos professores
        </button>

        <div className="teacher-detail-header">
          <div
            className="teacher-big-avatar"
            style={{ background: selectedTeacher.avatarColor }}
          >
            {selectedTeacher.name[0]}
          </div>
          <div>
            <h1 className="teacher-detail-name">{selectedTeacher.name}</h1>
            <p className="teacher-detail-meta">
              <Mail size={14} /> {selectedTeacher.email}
            </p>
            <p className="teacher-detail-meta">
              <BookOpen size={14} /> {selectedTeacher.subject}
            </p>
          </div>
        </div>

        <h2 className="section-label">Materiais Enviados por {selectedTeacher.name.split(' ')[1] || selectedTeacher.name}</h2>

        {teacherMaterials.length > 0 ? (
          <div className="smaterials-grid">
            {teacherMaterials.map(m => (
              <div key={m.id} className="smaterial-card">
                <div className="smaterial-icon-wrap">
                  <FileText size={22} />
                </div>
                <div className="smaterial-body">
                  <p className="smaterial-preview">
                    {m.adapted.substring(0, 130).replace(/[#*`]/g, '')}…
                  </p>
                  <span className="smaterial-date">
                    {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <button className="btn-read-sm" onClick={() => setSelectedMaterial(m)}>
                  <BookOpen size={14} /> Ler
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={40} />
            <p>Nenhum material enviado ainda.</p>
          </div>
        )}
      </div>
    )
  }

  // ── Carregando ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="student-sub-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <span className="spinner" style={{ borderColor: 'var(--color-primary-subtle)', borderTopColor: 'var(--color-primary)', width: '32px', height: '32px' }} />
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>Buscando professores e turmas...</p>
      </div>
    )
  }

  // ── Lista de professores ───────────────────────────────────
  return (
    <div className="student-sub-page animate-fade-in">
      <div className="page-top">
        <div>
          <h1 className="spage-title">Meus Professores</h1>
          <p className="spage-subtitle">
            Veja seus professores e os materiais que eles enviaram para você.
          </p>
        </div>
      </div>

      <div className="teachers-list">
        {teachers.map(teacher => {
          const count = myMaterials.filter(m => m.createdBy === teacher.id).length
          return (
            <button
              key={teacher.id}
              className="teacher-card"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div
                className="teacher-avatar"
                style={{ background: teacher.avatarColor }}
              >
                {teacher.name[0]}
              </div>
              <div className="teacher-info">
                <span className="teacher-name">{teacher.name}</span>
                <span className="teacher-subject">
                  <BookOpen size={12} /> {teacher.subject}
                </span>
                <span className="teacher-email">
                  <Mail size={12} /> {teacher.email}
                </span>
              </div>
              <div className="teacher-badge-wrap">
                <span className="teacher-mat-count">{count} material{count !== 1 && 'is'}</span>
                <ChevronRight size={18} className="teacher-chevron" />
              </div>
            </button>
          )
        })}
      </div>

      {teachers.length === 0 && (
        <div className="empty-state">
          <User size={48} />
          <h2>Nenhum professor encontrado</h2>
          <p>Você ainda não foi adicionado a nenhuma turma.</p>
        </div>
      )}
    </div>
  )
}

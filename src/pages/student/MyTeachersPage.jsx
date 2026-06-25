import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useClasses } from '../../hooks/useClasses'
import { useLibrary } from '../../hooks/useLibrary'
import ReactMarkdown from 'react-markdown'
import {
  GraduationCap, FileText, ArrowLeft, BookOpen,
  FolderOpen, User, Mail, ChevronRight, Package
} from 'lucide-react'
import './StudentPagesShared.css'

// Mock data — professores que compartilharam materiais com este aluno
// Em produção viria de uma API/backend; aqui lemos do hook de classes simulado.
const MOCK_TEACHERS = [
  {
    id: 'teacher-1',
    name: 'Prof. Ana Oliveira',
    email: 'ana@escola.edu.br',
    subject: 'Matemática',
    avatarColor: 'var(--color-tea)',
  },
  {
    id: 'teacher-2',
    name: 'Prof. Carlos Lima',
    email: 'carlos@escola.edu.br',
    subject: 'Português',
    avatarColor: 'var(--color-adhd)',
  },
]

export default function MyTeachersPage() {
  const { user } = useAuth()
  const { materials } = useLibrary()

  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  // Filtra materiais por condição do aluno (simula materiais enviados pelo professor)
  const myMaterials = materials.filter(m => m.condition === user?.condition)

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
    const teacherMaterials = myMaterials // Em produção: filtrar por teacherId
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

        <h2 className="section-label">Materiais Enviados por {selectedTeacher.name.split(' ')[1]}</h2>

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
        {MOCK_TEACHERS.map(teacher => {
          const count = myMaterials.length // Em produção: filtrar por teacher
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

      {MOCK_TEACHERS.length === 0 && (
        <div className="empty-state">
          <User size={48} />
          <h2>Nenhum professor encontrado</h2>
          <p>Você ainda não foi adicionado a nenhuma turma.</p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLibrary } from '../../hooks/useLibrary'
import ReactMarkdown from 'react-markdown'
import {
  BookOpen, FileText, ArrowLeft, ChevronRight,
  Calculator, Globe, FlaskConical, Palette, Music,
  Dumbbell, Code2, History, Microscope, Languages, FolderOpen
} from 'lucide-react'
import './StudentPagesShared.css'

const SUBJECTS = [
  { id: 'matematica',    label: 'Matemática',        icon: Calculator,    color: 'var(--color-tea)' },
  { id: 'portugues',     label: 'Português',          icon: Languages,     color: 'var(--color-dyslexia)' },
  { id: 'historia',      label: 'História',           icon: History,       color: 'hsl(25, 70%, 50%)' },
  { id: 'geografia',     label: 'Geografia',          icon: Globe,         color: 'hsl(160, 55%, 40%)' },
  { id: 'ciencias',      label: 'Ciências',           icon: Microscope,    color: 'hsl(200, 65%, 42%)' },
  { id: 'biologia',      label: 'Biologia',           icon: FlaskConical,  color: 'hsl(145, 60%, 38%)' },
  { id: 'artes',         label: 'Artes',              icon: Palette,       color: 'hsl(280, 55%, 52%)' },
  { id: 'ed_fisica',     label: 'Educação Física',    icon: Dumbbell,      color: 'hsl(10, 70%, 50%)' },
  { id: 'ingles',        label: 'Inglês',             icon: BookOpen,      color: 'hsl(220, 60%, 48%)' },
  { id: 'informatica',   label: 'Informática',        icon: Code2,         color: 'hsl(260, 50%, 50%)' },
  { id: 'musica',        label: 'Música',             icon: Music,         color: 'hsl(320, 55%, 48%)' },
]

export default function MySubjectsPage() {
  const { user } = useAuth()
  const { materials } = useLibrary()

  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  // Em produção: filtrar por m.subject === selectedSubject.id
  // Aqui usamos todos os materiais da condição do aluno como demo
  const myMaterials = materials.filter(m => m.condition === user?.condition)

  const getMaterialsForSubject = (subjectId) =>
    myMaterials.filter(m => (m.subject || '') === subjectId || myMaterials.length > 0)
  // Note: fallback mostra todos para fins de demo — em produção filtrar por m.subject

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

  // ── Materiais da matéria ───────────────────────────────────
  if (selectedSubject) {
    const subjectMaterials = myMaterials // demo: todos os materiais do aluno
    const SubIcon = selectedSubject.icon

    return (
      <div className="student-sub-page animate-fade-in">
        <button className="btn-back-link" onClick={() => setSelectedSubject(null)}>
          <ArrowLeft size={16} /> Voltar às matérias
        </button>

        <div className="subject-detail-header" style={{ '--s-color': selectedSubject.color }}>
          <div className="subject-detail-icon">
            <SubIcon size={28} />
          </div>
          <div>
            <h1 className="subject-detail-name">{selectedSubject.label}</h1>
            <p className="spage-subtitle">{subjectMaterials.length} material{subjectMaterials.length !== 1 ? 'is' : ''} disponível{subjectMaterials.length !== 1 ? 'is' : ''}</p>
          </div>
        </div>

        {subjectMaterials.length > 0 ? (
          <div className="smaterials-grid">
            {subjectMaterials.map(m => (
              <div key={m.id} className="smaterial-card">
                <div className="smaterial-icon-wrap" style={{ color: selectedSubject.color }}>
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
            <FolderOpen size={40} />
            <p>Nenhum material disponível para {selectedSubject.label} ainda.</p>
          </div>
        )}
      </div>
    )
  }

  // ── Grade de matérias ──────────────────────────────────────
  return (
    <div className="student-sub-page animate-fade-in">
      <div className="page-top">
        <div>
          <h1 className="spage-title">Minhas Matérias</h1>
          <p className="spage-subtitle">
            Selecione uma matéria para ver os materiais adaptados disponíveis.
          </p>
        </div>
      </div>

      <div className="subjects-grid">
        {SUBJECTS.map(subject => {
          const Icon = subject.icon
          const count = myMaterials.length // demo — em produção filtrar por subject.id
          return (
            <button
              key={subject.id}
              className="subject-card"
              style={{ '--s-color': subject.color }}
              onClick={() => setSelectedSubject(subject)}
            >
              <div className="subject-card-icon">
                <Icon size={26} />
              </div>
              <span className="subject-card-label">{subject.label}</span>
              <span className="subject-card-count">{count} mat.</span>
              <ChevronRight size={16} className="subject-chevron" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

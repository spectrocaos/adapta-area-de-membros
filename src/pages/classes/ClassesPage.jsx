import { useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useClasses } from '../../hooks/useClasses'
import { Users, GraduationCap, FolderOpen, Plus, Trash2, ChevronRight, ArrowLeft, ArrowRight, Brain, BookOpen, Zap, Eye } from 'lucide-react'
import './ClassesPage.css'

const CONDITIONS = [
  { id: 'tea', label: 'TEA', icon: Brain, color: 'var(--color-tea)' },
  { id: 'dyslexia', label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)' },
  { id: 'adhd', label: 'TDAH', icon: Zap, color: 'var(--color-adhd)' },
  { id: 'color_blind', label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)' },
]

export default function ClassesPage() {
  const { classes, createClass, deleteClass } = useClasses()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', grade: '', description: '' })
  
  const studentsCarouselRef = useRef(null)

  const allStudents = useMemo(() => {
    return (classes || []).flatMap(c => 
      (c.students || []).map(s => ({ ...s, className: c.name, classId: c.id }))
    )
  }, [classes])

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 340 // Largura do card + gap
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.grade) return
    createClass(formData.name, formData.grade, formData.description)
    setFormData({ name: '', grade: '', description: '' })
    setIsModalOpen(false)
  }

  const handleDelete = (id, e) => {
    e.preventDefault()
    if (window.confirm('Deletar esta turma e remover os alunos?')) {
      deleteClass(id)
    }
  }

  return (
    <div className="classes-page animate-fade-in">
      <div className="classes-header">
        <div>
          <h1 className="classes-title">Minhas Turmas</h1>
          <p className="classes-subtitle">
            Gerencie seus alunos e compartilhe materiais adaptados.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Nova Turma
        </button>
      </div>

      <div className="classes-section">
        <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Visão Geral das Turmas</h2>

      {classes.length > 0 ? (
        <div className="classes-grid">
          {classes.map(c => (
            <Link key={c.id} to={`/turmas/${c.id}`} className="class-card">
              <div className="class-card-header">
                <div className="class-icon">
                  <GraduationCap size={24} color="var(--color-primary)" />
                </div>
                <button 
                  className="btn-icon delete" 
                  onClick={(e) => handleDelete(c.id, e)}
                  title="Deletar Turma"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="class-card-body">
                <h3 className="class-name">{c.name}</h3>
                <p className="class-grade">{c.grade}</p>
                {c.description && <p className="class-desc">{c.description}</p>}
              </div>

              <div className="class-card-footer">
                <div className="class-stats">
                  <span title="Alunos"><Users size={14} /> {c.students.length}</span>
                  <span title="Materiais Compartilhados"><FolderOpen size={14} /> {c.sharedMaterials.length}</span>
                </div>
                <span className="class-link">
                  Gerenciar <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="classes-empty">
          <Users size={48} className="empty-icon" />
          <h2 className="empty-title">Nenhuma turma criada</h2>
          <p className="empty-subtitle">
            Crie turmas para adicionar alunos e compartilhar materiais específicos para eles.
          </p>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            Criar primeira turma
          </button>
        </div>
      )}
      </div>

      {allStudents.length > 0 && (
        <div className="students-carousel-section">
          <div className="section-header">
            <h2 className="section-title">Alunos Matriculados</h2>
          </div>

          <div className="carousel-grid" ref={studentsCarouselRef}>
            {allStudents.map(student => {
              const cond = CONDITIONS.find(c => c.id === student.condition)
              return (
                <Link to={`/turmas/${student.classId}`} key={`${student.classId}-${student.id}`} className="student-carousel-card">
                  <div className="student-card-avatar" style={{ background: cond?.color || 'var(--color-primary)' }}>
                    {student.name[0].toUpperCase()}
                  </div>
                  <div className="student-card-info">
                    <span className="student-card-name">{student.name}</span>
                    <span className="student-card-class">Turma: {student.className}</span>
                    {cond && (
                      <span className="student-card-badge" style={{ color: cond.color, background: `color-mix(in srgb, ${cond.color} 15%, white)` }}>
                        <cond.icon size={10} /> {cond.label}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* Carousel Navigation */}
          <div className="carousel-nav">
            <button 
              className="carousel-btn" 
              onClick={() => scrollCarousel(studentsCarouselRef, 'left')}
              aria-label="Rolar para a esquerda"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              className="carousel-btn" 
              onClick={() => scrollCarousel(studentsCarouselRef, 'right')}
              aria-label="Rolar para a direita"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Nova Turma */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Nova Turma</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nome da Turma</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Turma A - Manhã"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ano Escolar</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: 8º Ano do Ensino Fundamental"
                  value={formData.grade}
                  onChange={e => setFormData({ ...formData, grade: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Descrição (opcional)</label>
                <textarea 
                  placeholder="Anotações sobre a turma..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

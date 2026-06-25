import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLibrary } from '../../hooks/useLibrary'
import ReactMarkdown from 'react-markdown'
import { FolderOpen, FileText, ArrowLeft, BookOpen } from 'lucide-react'
import './StudentMaterialsPage.css'

export default function StudentMaterialsPage() {
  const { user } = useAuth()
  const { materials } = useLibrary()
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  // Filtra apenas os materiais adaptados para a condição do aluno
  const myMaterials = materials.filter(m => m.condition === user?.condition)

  if (selectedMaterial) {
    return (
      <div className="reading-view animate-fade-in">
        <div className="reading-header">
          <button className="btn-back-link" onClick={() => setSelectedMaterial(null)}>
            <ArrowLeft size={16} /> Voltar aos materiais
          </button>
          <span className="reading-date">
            Disponibilizado em {new Date(selectedMaterial.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
        
        <div className="reading-content markdown-body">
          <ReactMarkdown>{selectedMaterial.adapted}</ReactMarkdown>
        </div>
      </div>
    )
  }

  return (
    <div className="student-materials-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Meus Materiais de Estudo</h1>
        <p className="page-subtitle">
          Textos e conteúdos adaptados especialmente para você pelo seu professor.
        </p>
      </div>

      {myMaterials.length > 0 ? (
        <div className="materials-grid">
          {myMaterials.map(m => (
            <div key={m.id} className="s-material-card">
              <div className="s-material-icon">
                <FileText size={24} color="var(--color-primary)" />
              </div>
              <div className="s-material-content">
                <p className="s-material-preview">
                  {m.adapted.substring(0, 150).replace(/[#*`]/g, '')}...
                </p>
                <span className="s-material-date">
                  {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button className="btn-read" onClick={() => setSelectedMaterial(m)}>
                <BookOpen size={16} /> Ler Material
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-materials">
          <FolderOpen size={48} className="empty-icon" />
          <h2 className="empty-title">Nenhum material novo</h2>
          <p className="empty-subtitle">
            Seu professor ainda não compartilhou nenhum material de estudo adaptado para o seu perfil.
          </p>
        </div>
      )}
    </div>
  )
}

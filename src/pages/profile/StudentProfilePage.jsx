import { useState, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import { LogOut, Monitor, Type, AlignLeft, EarOff, Pencil, Camera, X, Check, Loader } from 'lucide-react'
import './StudentProfilePage.css'

// Comprime a imagem usando Canvas para manter tamanho < 500KB
function compressImage(dataUrl, maxWidth = 400, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}

export default function StudentProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const { preferences, updatePreference } = usePreferences()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editName, setEditName]   = useState(user?.name || '')
  const [editPhoto, setEditPhoto] = useState(user?.photoUrl || null)
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const fileInputRef = useRef(null)

  const handleOpenEdit = () => {
    setEditName(user?.name || '')
    setEditPhoto(user?.photoUrl || null)
    setPreviewPhoto(null)
    setSaveError('')
    setIsEditModalOpen(true)
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      // Comprime antes de guardar no estado
      const compressed = await compressImage(ev.target.result)
      setPreviewPhoto(compressed)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    const updates = { name: editName.trim() || user?.name }
    if (previewPhoto) updates.photoUrl = previewPhoto
    const result = await updateUser(updates)
    setSaving(false)
    if (result?.success) {
      setIsEditModalOpen(false)
    } else {
      setSaveError(result?.error || 'Erro ao salvar. Tente novamente.')
    }
  }

  const handleRemovePhoto = () => {
    setPreviewPhoto(null)
    setEditPhoto(null)
  }

  const currentPhoto = user?.photoUrl || null
  const avatarInitial = user?.name?.[0]?.toUpperCase()

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-header">
        {/* Avatar */}
        <div className="profile-avatar-wrapper">
          {currentPhoto
            ? <img src={currentPhoto} alt="Foto de perfil" className="profile-avatar profile-avatar-img" />
            : <div className="profile-avatar">{avatarInitial}</div>
          }
        </div>

        <div className="profile-header-info">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          <span className="profile-badge">
            {user?.profile === 'teacher' ? 'Professor' : 'Aluno'}
          </span>
        </div>

        {/* Botão de Editar */}
        <button className="btn-edit-profile" onClick={handleOpenEdit} title="Editar perfil">
          <Pencil size={16} /> Editar Perfil
        </button>
      </div>

      <div className="profile-content">
        <div className="settings-section">
          <h2 className="settings-title">Acessibilidade e Visualização</h2>
          <p className="settings-subtitle">Ajuste como a plataforma aparece para você.</p>
          
          <div className="settings-grid">
            {/* ── TEMA ── */}
            <div className="setting-card">
              <div className="setting-header">
                <Monitor size={20} className="setting-icon" />
                <h3>Tema Visual</h3>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-btn ${preferences.theme === 'light' ? 'active' : ''}`}
                  onClick={() => updatePreference('theme', 'light')}
                >Claro</button>
                <button 
                  className={`setting-btn ${preferences.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => updatePreference('theme', 'dark')}
                >Escuro</button>
                <button 
                  className={`setting-btn ${preferences.theme === 'high-contrast' ? 'active' : ''}`}
                  onClick={() => updatePreference('theme', 'high-contrast')}
                >Alto Contraste</button>
              </div>
            </div>

            {/* ── FONTE ── */}
            <div className="setting-card">
              <div className="setting-header">
                <Type size={20} className="setting-icon" />
                <h3>Tamanho da Fonte</h3>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-btn ${preferences.fontSize === 'normal' ? 'active' : ''}`}
                  onClick={() => updatePreference('fontSize', 'normal')}
                >Normal</button>
                <button 
                  className={`setting-btn ${preferences.fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => updatePreference('fontSize', 'large')}
                >Grande</button>
                <button 
                  className={`setting-btn ${preferences.fontSize === 'extra-large' ? 'active' : ''}`}
                  onClick={() => updatePreference('fontSize', 'extra-large')}
                >Extra Grande</button>
              </div>
            </div>

            {/* ── ESPAÇAMENTO ── */}
            <div className="setting-card">
              <div className="setting-header">
                <AlignLeft size={20} className="setting-icon" />
                <h3>Espaçamento do Texto</h3>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-btn ${preferences.spacing === 'normal' ? 'active' : ''}`}
                  onClick={() => updatePreference('spacing', 'normal')}
                >Padrão</button>
                <button 
                  className={`setting-btn ${preferences.spacing === 'wide' ? 'active' : ''}`}
                  onClick={() => updatePreference('spacing', 'wide')}
                >Amplo</button>
              </div>
            </div>

            {/* ── MODO BAIXA ESTIMULAÇÃO ── */}
            <div className="setting-card">
              <div className="setting-header">
                <EarOff size={20} className="setting-icon" />
                <div>
                  <h3>Modo Foco / Baixa Estimulação</h3>
                  <p className="setting-hint">Remove animações e suaviza o contraste de fundo.</p>
                </div>
              </div>
              <div className="setting-options">
                <label className="param-toggle">
                  <input 
                    type="checkbox" 
                    checked={!!preferences.lowStimulation} 
                    onChange={() => updatePreference('lowStimulation', !preferences.lowStimulation)}
                  />
                  <span className="toggle-slider"></span>
                  <span className="param-label">{preferences.lowStimulation ? 'Ativado' : 'Desativado'}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-logout" onClick={logout}>
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </div>

      {/* ── MODAL: Editar Perfil ── */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content edit-profile-modal" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2 className="modal-title">Editar Perfil</h2>
              <button className="btn-icon" onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Preview do avatar */}
            <div className="edit-avatar-section">
              <div className="edit-avatar-preview">
                {(previewPhoto || editPhoto)
                  ? <img src={previewPhoto || editPhoto} alt="Preview" className="edit-avatar-img" />
                  : <div className="edit-avatar-initials">{editName?.[0]?.toUpperCase() || avatarInitial}</div>
                }
                {/* Botão câmera sobre o avatar */}
                <button
                  className="edit-avatar-camera-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Alterar foto"
                >
                  <Camera size={18} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-input"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <div className="edit-avatar-actions">
                <button className="btn-outline" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={14} /> Escolher foto
                </button>
                {(previewPhoto || editPhoto) && (
                  <button className="btn-ghost" onClick={handleRemovePhoto}>
                    <X size={14} /> Remover foto
                  </button>
                )}
              </div>
            </div>

            {/* Campo nome */}
            <div className="modal-form">
              <div className="form-group">
                <label>Nome completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  O e-mail não pode ser alterado.
                </span>
              </div>

              <div className="modal-actions">
                {saveError && (
                  <p style={{ color: 'var(--color-error, #e53e3e)', fontSize: 'var(--text-sm)', margin: '0 0 8px', textAlign: 'center', width: '100%' }}>
                    {saveError}
                  </p>
                )}
                <button type="button" className="btn-outline" onClick={() => setIsEditModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="button" className="btn-primary" onClick={handleSave} disabled={!editName.trim() || saving}>
                  {saving
                    ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Salvando...</>
                    : <><Check size={16} /> Salvar alterações</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

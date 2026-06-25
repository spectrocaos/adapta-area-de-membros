import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useConverter } from '../../hooks/useConverter'
import { useLibrary } from '../../hooks/useLibrary'
import { useCreatorCourses } from '../../hooks/useCreatorCourses'
import { mockAdaptationPipeline } from '../../services/mockAdaptationPipeline'
import {
  FileText, FileUp, Video, Settings2, Sparkles,
  Download, BookmarkPlus, ArrowRight, ArrowLeft,
  Brain, BookOpen, Zap, Eye, AlertCircle, Image as ImageIcon, Share2,
  Mic, Network, Presentation, Copy, HelpCircle, BarChart2, Table
} from 'lucide-react'
import ShareModal from '../../components/ui/ShareModal'
import './ConverterPage.css'

const CONDITIONS = [
  { id: 'tea', label: 'TEA', icon: Brain, color: 'var(--color-tea)' },
  { id: 'dyslexia', label: 'Dislexia', icon: BookOpen, color: 'var(--color-dyslexia)' },
  { id: 'adhd', label: 'TDAH', icon: Zap, color: 'var(--color-adhd)' },
  { id: 'color_blind', label: 'Daltonismo', icon: Eye, color: 'var(--color-color-blind)' },
]

const PARAMS = {
  tea: [
    { id: 'shortSentences', label: 'Frases curtas (máx 15 pal.)' },
    { id: 'removeFigures', label: 'Remover figuras de linguagem' },
    { id: 'listFormat', label: 'Estruturar em listas' },
    { id: 'concreteVocab', label: 'Vocabulário concreto' },
  ],
  dyslexia: [
    { id: 'shortParagraphs', label: 'Parágrafos curtos' },
    { id: 'boldKeywords', label: 'Destacar palavras-chave em negrito' },
    { id: 'simpleVocab', label: 'Vocabulário simplificado' },
  ],
  adhd: [
    { id: 'summaryFirst', label: 'Incluir resumo no início' },
    { id: 'bulletPoints', label: 'Forçar uso de bullet points' },
    { id: 'shortBlocks', label: 'Blocos curtos (máx 4 linhas)' },
    { id: 'removeRepetitions', label: 'Remover repetições' },
  ],
  color_blind: [
    { id: 'noColorRefs', label: 'Remover referências de cores' },
    { id: 'describePatterns', label: 'Descrever padrões e formas' },
    { id: 'highContrastText', label: 'Alto contraste em tabelas/gráficos' },
  ]
}

const FORMATS = [
  { id: 'resumo_texto', label: 'Resumo...', icon: FileText },
  { id: 'apresentacao', label: 'Apresent...', icon: Presentation },
  { id: 'mapa_mental', label: 'Mapa...', icon: Network },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'flashcards', label: 'Cartões...', icon: Copy },
  { id: 'teste', label: 'Teste', icon: HelpCircle },
  { id: 'infografico', label: 'Infográfico', icon: BarChart2 },
  { id: 'tabela', label: 'Tabela d...', icon: Table }
]

export default function ConverterPage() {
  const {
    step, setStep,
    inputType, setInputType,
    rawContent, setRawContent,
    file, setFile,
    condition, setCondition,
    params, setParams,
    loadingMsg, result, error,
    handleNextStep, handlePrevStep,
    startConversion, reset
  } = useConverter()

  const { saveMaterial, saveProfile } = useLibrary()
  const { addLessonToCourse } = useCreatorCourses()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('courseId')
  const navigate = useNavigate()
  
  const [outputFormat, setOutputFormat] = useState('resumo_texto')
  const [shareModalOpen, setShareModalOpen] = useState(false)
  
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [targetProfile, setTargetProfile] = useState(condition || 'tea')
  const [lessonName, setLessonName] = useState('')
  const [isAdapting, setIsAdapting] = useState(false)

  // Se veio da página de perfis com um preset, aplica e vai pro step 1 (ou 2)
  useEffect(() => {
    if (location.state?.presetProfile) {
      const p = location.state.presetProfile
      setCondition(p.condition)
      setTimeout(() => setParams(p.params), 50) // delay para sobrescrever o useEffect abaixo
      window.history.replaceState({}, document.title) // limpa o state
    }
  }, [location.state, setCondition, setParams])

  // Sincroniza params iniciais quando a condição muda (apenas se não tiver um preset ativo)
  useEffect(() => {
    const defaultParams = PARAMS[condition].reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
    setParams(defaultParams)
  }, [condition, setParams])

  const toggleParam = (id) => {
    setParams(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result.adapted], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Material_Adaptado_${condition}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSaveMaterial = () => {
    if (!result) return
    saveMaterial({
      condition: result.condition,
      original: result.original,
      adapted: result.adapted,
      format: outputFormat
    })
    alert('Material salvo na sua biblioteca!')
  }

  const handleSaveToCourse = async () => {
    if (!result || !courseId) return
    setTargetProfile(condition || 'tea')
    setLessonName(outputFormat === 'resumo_texto' ? 'Resumo Adaptado' : 'Material Adaptado')
    setCourseModalOpen(true)
  }

  const confirmCreateLesson = async () => {
    setIsAdapting(true)
    const adaptation = await mockAdaptationPipeline(result.original, targetProfile)
    
    addLessonToCourse(courseId, {
      title: lessonName || 'Material Adaptado',
      type: 'text',
      duration: '5 min',
      activities: adaptation.activities
    })
    
    // Salva na biblioteca também
    saveMaterial({
      condition: result.condition,
      original: result.original,
      adapted: result.adapted,
      format: outputFormat
    })
    
    setIsAdapting(false)
    navigate(`/meus-cursos/${courseId}`)
  }

  const handleSaveProfile = () => {
    const name = window.prompt('Dê um nome para este perfil (ex: "TDAH Completo"):')
    if (name) {
      saveProfile(name, condition, params)
      alert('Perfil salvo com sucesso!')
    }
  }

  // Permite avançar no Step 1 se tiver arquivo válido OU texto suficiente
  const isFileBased = ['pdf', 'doc', 'image'].includes(inputType)
  const canGoToConfig = (isFileBased && file) || (!isFileBased && rawContent.length >= 50)

  return (
    <div className="converter-page animate-fade-in">
      
      {/* ── Header e Stepper ── */}
      <div className="converter-header">
        <h1 className="converter-title">
          <Sparkles className="title-icon" /> Conversor com IA
        </h1>
        <p className="converter-subtitle">
          Adapte seus materiais didáticos automaticamente para diferentes perfis de alunos.
        </p>

        <div className="stepper">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`step ${step >= num ? 'active' : ''} ${step > num ? 'done' : ''}`}>
              <div className="step-circle">{num}</div>
              <span className="step-label">
                {num === 1 ? 'Upload' : num === 2 ? 'Configuração' : num === 3 ? 'Processando' : 'Resultado'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="converter-body">
        
        {/* ── STEP 1: UPLOAD ── */}
        {step === 1 && (
          <div className="step-content animate-fade-in">
            <h2 className="step-title">1. O que você quer adaptar?</h2>
            
            <div className="input-tabs" style={{ flexWrap: 'wrap' }}>
              <button 
                className={`tab-btn ${inputType === 'pdf' ? 'active' : ''}`}
                onClick={() => setInputType('pdf')}
              >
                <FileUp size={18} /> Arquivo PDF
              </button>
              <button 
                className={`tab-btn ${inputType === 'doc' ? 'active' : ''}`}
                onClick={() => setInputType('doc')}
              >
                <FileText size={18} /> Doc Word
              </button>
              <button 
                className={`tab-btn ${inputType === 'image' ? 'active' : ''}`}
                onClick={() => setInputType('image')}
              >
                <ImageIcon size={18} /> Imagem / Foto
              </button>
              <button 
                className={`tab-btn ${inputType === 'text' ? 'active' : ''}`}
                onClick={() => setInputType('text')}
              >
                <FileText size={18} /> Colar Texto
              </button>
              <button 
                className={`tab-btn ${inputType === 'video' ? 'active' : ''}`}
                onClick={() => setInputType('video')}
              >
                <Video size={18} /> Link de Vídeo
              </button>
            </div>

            <div className="input-area">
              {isFileBased && (
                <div className="upload-box">
                  <input 
                    type="file" 
                    id="file-upload" 
                    accept={inputType === 'pdf' ? '.pdf' : inputType === 'doc' ? '.doc,.docx' : 'image/*'} 
                    onChange={e => setFile(e.target.files[0])}
                    className="hidden-input"
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    {inputType === 'image' ? <ImageIcon size={40} className="upload-icon" /> : <FileUp size={40} className="upload-icon" />}
                    {file ? (
                      <span className="upload-success">✅ {file.name} selecionado</span>
                    ) : (
                      <>
                        <span className="upload-text">Clique para selecionar seu arquivo</span>
                        <span className="upload-hint">O texto será extraído automaticamente.</span>
                      </>
                    )}
                  </label>
                </div>
              )}

              {inputType === 'text' && (
                <textarea 
                  className="content-textarea"
                  placeholder="Cole aqui o texto do seu material de estudo, prova ou atividade..."
                  value={rawContent}
                  onChange={e => setRawContent(e.target.value)}
                />
              )}

              {inputType === 'video' && (
                <div className="video-input-wrap">
                  <div className="video-alert">
                    <AlertCircle size={16} />
                    <p>A IA adapta apenas conteúdo textual. Cole a transcrição (ou legenda) do vídeo abaixo.</p>
                  </div>
                  <input type="url" placeholder="Link do vídeo (opcional)" className="video-url-input" />
                  <textarea 
                    className="content-textarea"
                    placeholder="Cole a transcrição do vídeo aqui..."
                    value={rawContent}
                    onChange={e => setRawContent(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="step-actions right">
              <button 
                className="btn-next" 
                disabled={!canGoToConfig}
                onClick={handleNextStep}
              >
                Próximo passo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: CONFIGURAÇÃO ── */}
        {step === 2 && (
          <div className="step-content animate-fade-in">
            <h2 className="step-title">2. Para qual perfil de aluno?</h2>
            
            <div className="conditions-grid">
              {CONDITIONS.map(cond => {
                const Icon = cond.icon
                const isActive = condition === cond.id
                return (
                  <button
                    key={cond.id}
                    className={`condition-card ${isActive ? 'active' : ''}`}
                    style={isActive ? { borderColor: cond.color, background: `color-mix(in srgb, ${cond.color} 5%, white)` } : {}}
                    onClick={() => setCondition(cond.id)}
                  >
                    <Icon size={28} color={isActive ? cond.color : 'var(--color-text-muted)'} />
                    <span className="condition-label" style={{ color: isActive ? cond.color : 'inherit' }}>
                      {cond.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="params-panel">
              <h3 className="params-title"><Settings2 size={18} /> Ajustes finos para {CONDITIONS.find(c=>c.id===condition)?.label}</h3>
              <div className="params-grid">
                {PARAMS[condition].map(p => (
                  <label key={p.id} className="param-toggle">
                    <input 
                      type="checkbox" 
                      checked={!!params[p.id]} 
                      onChange={() => toggleParam(p.id)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="param-label">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="formats-section">
              <h3 className="formats-title">O que deseja gerar?</h3>
              <div className="formats-grid">
                {FORMATS.map(fmt => {
                  const Icon = fmt.icon
                  const isActive = outputFormat === fmt.id
                  return (
                    <button
                      key={fmt.id}
                      className={`format-card ${isActive ? 'active' : ''}`}
                      onClick={() => setOutputFormat(fmt.id)}
                    >
                      <div className="format-icon-wrap">
                        <Icon size={18} />
                      </div>
                      <div className="format-info">
                        <span className="format-label">{fmt.label}</span>
                      </div>
                      <ArrowRight size={14} className="format-arrow" />
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="error-alert">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="step-actions between">
              <button className="btn-back" onClick={handlePrevStep}>
                <ArrowLeft size={16} /> Voltar
              </button>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn-outline" onClick={handleSaveProfile}>
                  <BookmarkPlus size={16} /> Salvar como Perfil
                </button>
                <button 
                  className="btn-convert" 
                  style={{ background: CONDITIONS.find(c=>c.id===condition)?.color }}
                  onClick={startConversion}
                >
                  <Sparkles size={16} /> Iniciar Conversão
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: LOADING ── */}
        {step === 3 && (
          <div className="step-content loading animate-fade-in">
            <div className="pulse-loader" style={{ borderColor: CONDITIONS.find(c=>c.id===condition)?.color }}>
              <Brain size={40} color={CONDITIONS.find(c=>c.id===condition)?.color} />
            </div>
            <h2 className="loading-title">{loadingMsg}</h2>
            <p className="loading-subtitle">Isso pode levar alguns segundos dependendo do tamanho do material.</p>
          </div>
        )}

        {/* ── STEP 4: RESULTADO ── */}
        {step === 4 && result && (
          <div className="step-content result animate-fade-in">
            <h2 className="step-title" style={{ textAlign: 'center', marginBottom: '0' }}>Adaptação Concluída!</h2>
            <div className="result-header" style={{ justifyContent: 'center' }}>
              <div className="result-actions">
                {courseId ? (
                  <button className="btn-primary" onClick={handleSaveToCourse}>
                    <BookmarkPlus size={16} /> Salvar no Curso
                  </button>
                ) : (
                  <button className="btn-primary" onClick={() => setShareModalOpen(true)}>
                    <Share2 size={16} /> Compartilhar com aluno
                  </button>
                )}
                <button className="btn-secondary" onClick={handleDownload}>
                  <Download size={16} /> Baixar
                </button>
                <button className="btn-outline" onClick={handleSaveMaterial}>
                  <BookmarkPlus size={16} /> Salvar na biblioteca
                </button>
                <button className="btn-ghost" onClick={reset}>
                  Nova conversão
                </button>
              </div>
            </div>

            <div className="split-view">
              <div className="split-pane original-pane">
                <div className="pane-header">Original</div>
                <div className="pane-body">
                  <pre>{result.original}</pre>
                </div>
              </div>

              <div className="split-pane adapted-pane">
                <div className="pane-header" style={{ color: CONDITIONS.find(c=>c.id===condition)?.color }}>
                  Adaptado ({CONDITIONS.find(c=>c.id===condition)?.label})
                </div>
                <div className="pane-body markdown-body">
                  <ReactMarkdown>{result.adapted}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        materialName={result?.condition} 
      />

      {courseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', background: 'white', padding: '2rem', borderRadius: '16px' }}>
            {isAdapting ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Brain size={48} color="var(--color-primary)" className="pulse" style={{ margin: '0 auto 1rem auto' }} />
                <h3>Adaptando para o perfil...</h3>
                <p>O motor de IA está extraindo as atividades para este curso.</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '1.5rem' }}>Configurar Nova Aula</h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome da Aula</label>
                  <input 
                    type="text" 
                    value={lessonName} 
                    onChange={e => setLessonName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Perfil de adaptação para esta aula</label>
                  <select 
                    value={targetProfile} 
                    onChange={e => setTargetProfile(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  >
                    {CONDITIONS.map(cond => (
                      <option key={cond.id} value={cond.id}>{cond.label}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn-secondary" onClick={() => setCourseModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={confirmCreateLesson}>Criar Aula Adaptada</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

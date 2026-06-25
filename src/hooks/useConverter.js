import { useState, useCallback } from 'react'
import { convertMaterial } from '../services/aiService'
import { extractTextFromPDF } from '../services/pdfService'

export function useConverter() {
  const [step, setStep] = useState(1) // 1: Upload, 2: Config, 3: Loading, 4: Result
  const [inputType, setInputType] = useState('text') // 'text', 'pdf', 'video'
  const [rawContent, setRawContent] = useState('')
  const [file, setFile] = useState(null)
  
  const [condition, setCondition] = useState('tea') // 'tea', 'dyslexia', 'adhd', 'color_blind'
  const [params, setParams] = useState({})
  
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleNextStep = () => setStep(s => Math.min(s + 1, 4))
  const handlePrevStep = () => setStep(s => Math.max(s - 1, 1))
  
  const reset = () => {
    setStep(1)
    setRawContent('')
    setFile(null)
    setResult(null)
    setError(null)
  }

  const startConversion = useCallback(async () => {
    try {
      setStep(3)
      setError(null)
      
      let textToConvert = rawContent
      
      // Se for PDF, precisamos extrair o texto primeiro
      if (inputType === 'pdf' && file) {
        setLoadingMsg('Extraindo texto do PDF...')
        textToConvert = await extractTextFromPDF(file)
      } else if (inputType === 'doc' && file) {
        setLoadingMsg('Lendo arquivo do Word...')
        await new Promise(r => setTimeout(r, 1200)) // Simulação
        textToConvert = "[CONTEÚDO SIMULADO DE DOCUMENTO WORD]\n\nA história do Brasil começa com a chegada dos portugueses em 1500. No entanto, o território já era habitado por milhões de indígenas de diversas etnias."
      } else if (inputType === 'image' && file) {
        setLoadingMsg('Analisando imagem (OCR)...')
        await new Promise(r => setTimeout(r, 1500)) // Simulação
        textToConvert = "[TEXTO EXTRAÍDO DA FOTO/IMAGEM]\n\nO sistema solar é composto pelo Sol e pelos corpos celestes que orbitam ao seu redor, como os planetas Terra, Marte e Júpiter."
      }

      setLoadingMsg('Adaptando material com Inteligência Artificial...')
      await new Promise(r => setTimeout(r, 1500))
      setLoadingMsg('Analisando estrutura e extraindo conceitos chave...')
      await new Promise(r => setTimeout(r, 2000))
      setLoadingMsg('Fragmentando conteúdo em blocos de atividade...')
      await new Promise(r => setTimeout(r, 2000))
      
      const adaptedMarkdown = await convertMaterial(textToConvert, condition, params)
      
      setResult({
        original: textToConvert,
        adapted: adaptedMarkdown,
        condition,
        date: new Date().toISOString()
      })
      
      setStep(4)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Erro inesperado durante a conversão.')
      setStep(2) // Volta para config em caso de erro
    }
  }, [rawContent, inputType, file, condition, params])

  return {
    step,
    setStep,
    inputType,
    setInputType,
    rawContent,
    setRawContent,
    file,
    setFile,
    condition,
    setCondition,
    params,
    setParams,
    loadingMsg,
    result,
    error,
    handleNextStep,
    handlePrevStep,
    startConversion,
    reset
  }
}

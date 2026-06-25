import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'

// Configuração do worker para rodar no browser via Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    
    let fullText = ''
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n\n'
    }
    
    if (!fullText.trim()) {
      throw new Error('Nenhum texto encontrado no PDF. Ele pode ser apenas uma imagem escaneada.')
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('Erro ao extrair PDF:', error)
    if (error.name === 'PasswordException') {
      throw new Error('Este PDF é protegido por senha e não pode ser lido.')
    }
    throw new Error(error.message || 'Falha ao ler o arquivo PDF.')
  }
}

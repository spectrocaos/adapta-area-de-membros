/**
 * Módulo Simulado do Motor de Adaptação (Fase 4)
 * Ele simula a análise e extração de blocos dinâmicos a partir de um material base.
 */

export const mockAdaptationPipeline = async (sourceContent, profileId) => {
  // Simula o delay de um motor de IA real
  await new Promise(resolve => setTimeout(resolve, 3000))

  const activities = [
    { id: 'act-1', type: 'audio', title: '🎧 Escuta', content: 'Áudio narrado com pausas para reflexão.' },
    { id: 'act-2', type: 'complete', title: '⬜ Complete', content: 'Exercício interativo para preencher lacunas com palavras ou figuras.' },
    { id: 'act-3', type: 'order', title: '🔀 Ordene', content: 'Organize a ordem correta dos acontecimentos descritos no material.' },
    { id: 'act-4', type: 'draw', title: '✏️ Desenhe', content: 'Área para o aluno desenhar o que entendeu. O professor também deixou um exemplo.' },
    { id: 'act-5', type: 'print', title: '📄 No papel', content: 'Material gerado em PDF com atividades motoras baseadas na aula.' }
  ]

  return {
    sourceContentExcerpt: typeof sourceContent === 'string' ? sourceContent.slice(0, 100) : 'Material convertido',
    extractedConcepts: ['História', 'Brasil', 'Chegada'],
    activities
  }
}

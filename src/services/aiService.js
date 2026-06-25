import { GoogleGenerativeAI } from '@google/generative-ai'

// ── Prompts especializados por condição ────────────────────────────────────
const CONDITION_PROMPTS = {
  tea: (params) => `
Você é um especialista em adaptação de conteúdo educativo para alunos com TEA (Transtorno do Espectro Autista).

Adapte o material abaixo seguindo RIGOROSAMENTE estas instruções:
${params.shortSentences ? '- Use frases CURTAS e DIRETAS (máximo 15 palavras por frase).' : ''}
${params.removeFigures ? '- REMOVA completamente figuras de linguagem, metáforas, ironias e ambiguidades. Substitua por linguagem literal e concreta.' : ''}
${params.listFormat ? '- Organize o conteúdo em LISTAS e TÓPICOS numerados. Evite parágrafos longos.' : ''}
${params.concreteVocab ? '- Use vocabulário CONCRETO e familiar. Evite palavras abstratas ou de duplo sentido.' : ''}
- Mantenha estrutura PREVISÍVEL: introdução clara, desenvolvimento numerado, conclusão direta.
- Use linguagem simples e objetiva.
- NÃO adicione conteúdo novo — apenas adapte o que existe.

Retorne APENAS o conteúdo adaptado em markdown limpo, sem comentários ou explicações.
`,
  dyslexia: (params) => `
Você é um especialista em adaptação de conteúdo educativo para alunos com Dislexia.

Adapte o material abaixo seguindo RIGOROSAMENTE estas instruções:
${params.shortParagraphs ? '- Quebre o texto em parágrafos CURTOS (máximo 3-4 frases cada).' : ''}
${params.boldKeywords ? '- Use **negrito** para destacar PALAVRAS-CHAVE e conceitos importantes.' : ''}
${params.simpleVocab ? '- Substitua palavras difíceis por sinônimos mais simples e comuns.' : ''}
${params.shortSentences ? '- Frases de no máximo 15 palavras. Uma ideia por frase.' : ''}
- Adicione espaçamento visual entre seções usando linhas em branco.
- Use marcadores de lista (•) em vez de parágrafos quando possível.
- NÃO adicione conteúdo novo — apenas adapte o que existe.

Retorne APENAS o conteúdo adaptado em markdown limpo, sem comentários ou explicações.
`,
  adhd: (params) => `
Você é um especialista em adaptação de conteúdo educativo para alunos com TDAH.

Adapte o material abaixo seguindo RIGOROSAMENTE estas instruções:
${params.summaryFirst ? '- Comece com um RESUMO em 2-3 bullet points do que será abordado.' : ''}
${params.bulletPoints ? '- Use BULLET POINTS obrigatoriamente. Evite parágrafos corridos.' : ''}
${params.shortBlocks ? '- Divida em BLOCOS CURTOS separados por subtítulos. Máximo 4 linhas por bloco.' : ''}
${params.removeRepetitions ? '- REMOVA repetições e informações redundantes. Seja conciso.' : ''}
- Destaque os pontos mais importantes com **negrito**.
- Use subtítulos claros (##) para cada seção.
- Termine com uma seção "## Pontos-chave" com os 3-5 principais aprendizados.
- NÃO adicione conteúdo novo — apenas adapte o que existe.

Retorne APENAS o conteúdo adaptado em markdown limpo, sem comentários ou explicações.
`,
  color_blind: (params) => `
Você é um especialista em adaptação de conteúdo educativo para alunos com Daltonismo.

Adapte o material abaixo seguindo RIGOROSAMENTE estas instruções:
${params.noColorRefs ? '- REMOVA todas as referências a cores como forma de identificar informação (ex: "o quadrado vermelho" → "o quadrado maior"). Substitua por forma, posição, tamanho ou padrão.' : ''}
${params.describePatterns ? '- Ao descrever elementos visuais, use PADRÕES, FORMAS e POSIÇÕES, não cores.' : ''}
${params.highContrastText ? '- Ao descrever gráficos ou tabelas, garanta que a diferenciação seja por RÓTULOS TEXTUAIS, não por cor.' : ''}
- Adicione descrições alternativas para qualquer elemento que dependa de cor para ser compreendido.
- NÃO adicione conteúdo novo — apenas adapte o que existe.

Retorne APENAS o conteúdo adaptado em markdown limpo, sem comentários ou explicações.
`,
}

// ── Mock realista por condição ─────────────────────────────────────────────
function generateMockResponse(content, condition) {
  const preview = content.slice(0, 200)
  const mocks = {
    tea: `## Conteúdo Adaptado para TEA

**Sobre o que é este texto:**
Este texto fala sobre o seguinte assunto.

**O que você vai aprender:**
1. Ponto um do conteúdo
2. Ponto dois do conteúdo
3. Ponto três do conteúdo

**Conteúdo principal:**

${preview.split('. ').map(s => `- ${s.trim()}.`).filter(Boolean).slice(0, 5).join('\n')}

**Para lembrar:**
- Este é o ponto mais importante.
- Leia devagar e com calma.`,

    dyslexia: `## Conteúdo Adaptado para Dislexia

${preview.split('. ').slice(0, 3).map(s => s.trim() + '.').join('\n\n')}

**Palavras importantes:** destacadas em **negrito**.

${preview.split('. ').slice(3, 6).map(s => `• ${s.trim()}.`).join('\n')}`,

    adhd: `## Resumo rápido

• Ponto 1 do conteúdo
• Ponto 2 do conteúdo  
• Ponto 3 do conteúdo

---

## Conteúdo Principal

**Parte 1**

${preview.split('. ')[0]?.trim()}.

**Parte 2**

${preview.split('. ')[1]?.trim()}.

---

## Pontos-chave

1. **Mais importante:** primeira ideia central
2. **Lembre-se:** segunda ideia central
3. **Atenção:** terceira ideia central`,

    color_blind: `## Conteúdo Adaptado (sem referências a cores)

${preview
  .replace(/vermelho/gi, 'elemento A')
  .replace(/verde/gi, 'elemento B')
  .replace(/azul/gi, 'elemento C')
  .replace(/amarelo/gi, 'elemento D')
  .split('. ')
  .slice(0, 6)
  .map(s => s.trim() + '.')
  .join('\n\n')}

> **Nota:** Todas as referências a cores foram substituídas por formas, posições e padrões.`,
  }
  return mocks[condition] || `## Material Adaptado\n\n${preview}`
}

// ── Chamada real ao Gemini ─────────────────────────────────────────────────
async function callGemini(content, condition, params) {
  const apiKey = import.meta.env.VITE_AI_API_KEY
  if (!apiKey || apiKey === 'sua-chave-aqui') {
    throw new Error('VITE_AI_API_KEY não configurada.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash' })

  const systemPrompt = CONDITION_PROMPTS[condition]?.(params) ?? ''
  const fullPrompt = `${systemPrompt}\n\n---\n\nMATERIAL ORIGINAL:\n\n${content}`

  const result = await model.generateContent(fullPrompt)
  return result.response.text()
}

// ── Função principal exportada ─────────────────────────────────────────────
export async function convertMaterial(content, condition, params) {
  // --- MODO FORÇADO: SIMULAÇÃO FAKE ---
  // A pedido do usuário, estamos simulando o sucesso temporariamente sem validar a chave real
  await new Promise(r => setTimeout(r, 2000))
  return generateMockResponse(content, condition)
  // ------------------------------------
}

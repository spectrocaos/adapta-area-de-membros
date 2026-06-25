import trailTea from '../assets/trail_tea.png'
import trailDyslexia from '../assets/trail_dyslexia.png'
import trailAdhd from '../assets/trail_adhd.png'
import trailColorblind from '../assets/trail_colorblind.png'
import trailInclusion from '../assets/trail_inclusion.png'

export const TRAILS = [
  {
    id: 'tea',
    label: 'TEA',
    fullLabel: 'Transtorno do Espectro Autista',
    color: 'var(--color-tea)',
    colorDark: 'var(--color-tea-dark)',
    colorLight: 'var(--color-tea-light)',
    thumb: trailTea,
    icon: 'Brain',
    description: 'Estratégias práticas para apoiar alunos com TEA em sala de aula inclusiva.',
  },
  {
    id: 'dyslexia',
    label: 'Dislexia',
    fullLabel: 'Dislexia',
    color: 'var(--color-dyslexia)',
    colorDark: 'var(--color-dyslexia-dark)',
    colorLight: 'var(--color-dyslexia-light)',
    thumb: trailDyslexia,
    icon: 'BookOpen',
    description: 'Metodologias e recursos para facilitar a leitura e escrita de alunos disléxicos.',
  },
  {
    id: 'adhd',
    label: 'TDAH',
    fullLabel: 'Transtorno de Déficit de Atenção e Hiperatividade',
    color: 'var(--color-adhd)',
    colorDark: 'var(--color-adhd-dark)',
    colorLight: 'var(--color-adhd-light)',
    thumb: trailAdhd,
    icon: 'Zap',
    description: 'Técnicas de engajamento e gestão do ambiente para alunos com TDAH.',
  },
  {
    id: 'color_blind',
    label: 'Daltonismo',
    fullLabel: 'Daltonismo e Deficiência Visual de Cores',
    color: 'var(--color-color-blind)',
    colorDark: 'var(--color-color-blind-dark)',
    colorLight: 'var(--color-color-blind-light)',
    thumb: trailColorblind,
    icon: 'Eye',
    description: 'Como adaptar materiais visuais e apresentações para alunos daltônicos.',
  },
  {
    id: 'inclusion',
    label: 'Inclusão Geral',
    fullLabel: 'Educação Inclusiva',
    color: 'var(--color-primary)',
    colorDark: 'var(--color-primary-dark)',
    colorLight: 'var(--color-primary-subtle)',
    thumb: trailInclusion,
    icon: 'Heart',
    description: 'Fundamentos da educação inclusiva e construção de uma sala de aula acolhedora.',
  },
]

export const COURSES = [
  // ── TEA ─────────────────────────────────────────────────────
  {
    id: 'tea-01',
    trailId: 'tea',
    title: 'Introdução ao TEA: Entendendo o Espectro',
    description: 'Compreenda o que é o Transtorno do Espectro Autista, suas características e como ele se manifesta em diferentes alunos dentro da sala de aula.',
    instructor: 'Dra. Ana Paula Rocha',
    duration: '3h 20min',
    totalLessons: 12,
    modules: [
      {
        id: 'tea-01-m1', title: 'O que é o TEA?',
        lessons: [
          { id: 'tea-01-l1', title: 'O espectro autista: definição e história', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l2', title: 'Como o TEA se manifesta: sinais e características', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l3', title: 'TEA e a sala de aula: cenário atual', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'tea-01-m2', title: 'Comunicação e Linguagem',
        lessons: [
          { id: 'tea-01-l4', title: 'Comunicação verbal e não-verbal no TEA', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l5', title: 'Comunicação alternativa e aumentativa (CAA)', duration: '25min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'tea-01-m3', title: 'Estratégias em Sala de Aula',
        lessons: [
          { id: 'tea-01-l6', title: 'Organização do ambiente físico', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l7', title: 'Rotinas e previsibilidade', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l8', title: 'Gestão de crises e sobrecarga sensorial', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l9', title: 'Adaptação de avaliações', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l10', title: 'Colaboração com família e equipe', duration: '21min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l11', title: 'Estudos de caso práticos', duration: '28min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-01-l12', title: 'Recapitulação e próximos passos', duration: '14min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'tea-02',
    trailId: 'tea',
    title: 'Adaptação de Materiais para Alunos com TEA',
    description: 'Aprenda na prática como transformar qualquer material didático em conteúdo acessível e estruturado para alunos com TEA.',
    instructor: 'Prof. Carlos Mendes',
    duration: '2h 45min',
    totalLessons: 9,
    modules: [
      {
        id: 'tea-02-m1', title: 'Princípios de Adaptação',
        lessons: [
          { id: 'tea-02-l1', title: 'Por que adaptar materiais?', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l2', title: 'Linguagem simples e objetiva', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l3', title: 'Estrutura visual e previsível', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'tea-02-m2', title: 'Adaptando na Prática',
        lessons: [
          { id: 'tea-02-l4', title: 'Adaptando textos didáticos', duration: '25min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l5', title: 'Adaptando provas e atividades', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l6', title: 'Usando tecnologia como apoio', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l7', title: 'Recursos visuais e pictogramas', duration: '21min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l8', title: 'Exemplos reais de adaptação', duration: '30min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-02-l9', title: 'Avaliação da efetividade', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'tea-03',
    trailId: 'tea',
    title: 'Integração Sensorial e Ambiente Escolar',
    description: 'Entenda como o perfil sensorial de alunos com TEA impacta a aprendizagem e saiba como criar um ambiente mais confortável.',
    instructor: 'Terapeuta Ocupacional Lia Santos',
    duration: '2h 10min',
    totalLessons: 8,
    modules: [
      {
        id: 'tea-03-m1', title: 'Processamento Sensorial',
        lessons: [
          { id: 'tea-03-l1', title: 'Os 8 sentidos e o TEA', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l2', title: 'Hiper e hipossensibilidade', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l3', title: 'Identificando o perfil sensorial do aluno', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l4', title: 'Ajustes no ambiente físico', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l5', title: 'Iluminação, ruído e temperatura', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l6', title: 'Estratégias de autorregulação', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l7', title: 'Equipamentos e recursos sensoriais', duration: '14min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'tea-03-l8', title: 'Plano de suporte sensorial', duration: '26min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },

  // ── DISLEXIA ─────────────────────────────────────────────────
  {
    id: 'dys-01',
    trailId: 'dyslexia',
    title: 'Dislexia: Identificação e Suporte Inicial',
    description: 'Aprenda a identificar sinais de dislexia, entender suas causas neurológicas e iniciar o suporte adequado ao aluno.',
    instructor: 'Neuropsicóloga Fernanda Lima',
    duration: '2h 50min',
    totalLessons: 10,
    modules: [
      {
        id: 'dys-01-m1', title: 'Entendendo a Dislexia',
        lessons: [
          { id: 'dys-01-l1', title: 'O que é dislexia: mitos e verdades', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l2', title: 'Bases neurológicas da dislexia', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l3', title: 'Sinais de alerta: quando suspeitar?', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'dys-01-m2', title: 'Estratégias Pedagógicas',
        lessons: [
          { id: 'dys-01-l4', title: 'Método fônico e multissensorial', duration: '25min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l5', title: 'Adaptações na leitura e escrita', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l6', title: 'Fontes e tipografia acessível', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l7', title: 'Adaptação de avaliações escritas', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l8', title: 'Tecnologias assistivas para dislexia', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l9', title: 'Apoio emocional ao aluno disléxico', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-01-l10', title: 'Plano de intervenção prático', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'dys-02',
    trailId: 'dyslexia',
    title: 'Leitura e Escrita Inclusiva: Ferramentas Práticas',
    description: 'Técnicas e ferramentas concretas para tornar a leitura e a escrita acessíveis a todos os alunos, com foco na dislexia.',
    instructor: 'Prof. Ricardo Alves',
    duration: '2h 20min',
    totalLessons: 8,
    modules: [
      {
        id: 'dys-02-m1', title: 'Materiais Acessíveis',
        lessons: [
          { id: 'dys-02-l1', title: 'Construindo textos acessíveis', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l2', title: 'Layout e formatação que facilitam a leitura', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l3', title: 'Usando áudio como suporte', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l4', title: 'Mapas mentais e organização visual', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l5', title: 'Ferramentas digitais gratuitas', duration: '25min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l6', title: 'Atividades hands-on e multissensoriais', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l7', title: 'Avaliação alternativa à escrita', duration: '17min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-02-l8', title: 'Portfólio como instrumento de avaliação', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'dys-03',
    trailId: 'dyslexia',
    title: 'Autoestima e Dislexia: O Lado Emocional',
    description: 'Estratégias para fortalecer a autoestima do aluno disléxico, lidar com frustrações e criar um ambiente de valorização da diversidade.',
    instructor: 'Psicóloga Mariana Costa',
    duration: '1h 55min',
    totalLessons: 7,
    modules: [
      {
        id: 'dys-03-m1', title: 'Impacto Emocional da Dislexia',
        lessons: [
          { id: 'dys-03-l1', title: 'Como a dislexia afeta a autoestima', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-03-l2', title: 'Dislexia e ansiedade escolar', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-03-l3', title: 'O papel do professor no suporte emocional', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-03-l4', title: 'Criando um clima de sala seguro', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-03-l5', title: 'Feedback positivo e motivação', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-03-l6', title: 'Parcerias com família e psicólogo', duration: '21min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'dys-03-l7', title: 'Celebrando as conquistas do aluno', duration: '6min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },

  // ── TDAH ─────────────────────────────────────────────────────
  {
    id: 'adhd-01',
    trailId: 'adhd',
    title: 'TDAH em Sala de Aula: Fundamentos',
    description: 'Entenda o TDAH além dos estereótipos e descubra estratégias eficazes para apoiar alunos com déficit de atenção e hiperatividade.',
    instructor: 'Psicopedagoga Juliana Torres',
    duration: '3h 05min',
    totalLessons: 11,
    modules: [
      {
        id: 'adhd-01-m1', title: 'Compreendendo o TDAH',
        lessons: [
          { id: 'adhd-01-l1', title: 'TDAH: o que é e o que não é', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l2', title: 'Os três subtipos do TDAH', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l3', title: 'TDAH e função executiva', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l4', title: 'Diagnóstico e encaminhamento', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'adhd-01-m2', title: 'Estratégias de Engajamento',
        lessons: [
          { id: 'adhd-01-l5', title: 'Organização do espaço e rotinas', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l6', title: 'Técnicas de atenção e foco', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l7', title: 'Atividades curtas e variadas', duration: '17min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l8', title: 'Uso positivo da hiperatividade', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l9', title: 'Instrução diferenciada no TDAH', duration: '21min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l10', title: 'Avaliação adaptada para TDAH', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-01-l11', title: 'Parceria com família e psiquiatra', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'adhd-02',
    trailId: 'adhd',
    title: 'Gestão de Comportamento e Atenção',
    description: 'Ferramentas práticas de gestão comportamental e técnicas de atenção focada para alunos com TDAH.',
    instructor: 'Prof. Eduardo Nunes',
    duration: '2h 30min',
    totalLessons: 9,
    modules: [
      {
        id: 'adhd-02-m1', title: 'Gestão Comportamental',
        lessons: [
          { id: 'adhd-02-l1', title: 'Reforço positivo e consequências', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l2', title: 'Sistema de pontos e recompensas', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l3', title: 'Contratos de comportamento', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l4', title: 'Redirecionamento sem confronto', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l5', title: 'Mindfulness para alunos com TDAH', duration: '17min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l6', title: 'Técnica Pomodoro adaptada', duration: '14min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l7', title: 'Pausas ativas e movimento', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l8', title: 'Comunicação não violenta com TDAH', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-02-l9', title: 'Plano de suporte individualizado', duration: '29min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'adhd-03',
    trailId: 'adhd',
    title: 'Materiais Didáticos para TDAH',
    description: 'Como criar e adaptar materiais que capturam e mantêm a atenção de alunos com TDAH.',
    instructor: 'Designer Educacional Sofia Ramos',
    duration: '2h 00min',
    totalLessons: 7,
    modules: [
      {
        id: 'adhd-03-m1', title: 'Design de Materiais para Atenção',
        lessons: [
          { id: 'adhd-03-l1', title: 'Princípios visuais para TDAH', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-03-l2', title: 'Fragmentação do conteúdo', duration: '17min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-03-l3', title: 'Uso de bullet points e listas', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-03-l4', title: 'Resumos iniciais e finais', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-03-l5', title: 'Gamificação de atividades', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-03-l6', title: 'Vídeos e multimídia como apoio', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'adhd-03-l7', title: 'Verificando a acessibilidade do material', duration: '12min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },

  // ── DALTONISMO ───────────────────────────────────────────────
  {
    id: 'cb-01',
    trailId: 'color_blind',
    title: 'Daltonismo: Tipos e Impacto na Aprendizagem',
    description: 'Conheça os diferentes tipos de daltonismo e entenda como eles afetam a experiência do aluno com materiais didáticos visuais.',
    instructor: 'Oftalmologista Dr. Marcos Pinto',
    duration: '1h 50min',
    totalLessons: 6,
    modules: [
      {
        id: 'cb-01-m1', title: 'Entendendo o Daltonismo',
        lessons: [
          { id: 'cb-01-l1', title: 'Tipos de daltonismo e prevalência', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-01-l2', title: 'Como o daltônico enxerga o mundo', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-01-l3', title: 'Impacto em mapas, gráficos e apresentações', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-01-l4', title: 'Identificando alunos com daltonismo', duration: '14min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-01-l5', title: 'Ferramentas de simulação de daltonismo', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-01-l6', title: 'Boas práticas visuais universais', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'cb-02',
    trailId: 'color_blind',
    title: 'Design Acessível para Daltônicos',
    description: 'Aprenda a criar apresentações, mapas e materiais visuais acessíveis para alunos daltônicos usando padrões, formas e contraste.',
    instructor: 'Designer Gráfica Camila Ferreira',
    duration: '2h 15min',
    totalLessons: 8,
    modules: [
      {
        id: 'cb-02-m1', title: 'Princípios de Design Acessível',
        lessons: [
          { id: 'cb-02-l1', title: 'Paletas de cores seguras para daltônicos', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l2', title: 'Usando formas e texturas além da cor', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l3', title: 'Alto contraste e legibilidade', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l4', title: 'Gráficos e infográficos acessíveis', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l5', title: 'Mapas e diagramas inclusivos', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l6', title: 'Apresentações no PowerPoint/Google Slides', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l7', title: 'Testando acessibilidade de materiais', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-02-l8', title: 'Checklist do material acessível', duration: '10min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'cb-03',
    trailId: 'color_blind',
    title: 'Tecnologia e Daltonismo em Sala Digital',
    description: 'Ferramentas digitais e configurações de dispositivos que ajudam alunos daltônicos a navegar em ambientes digitais de aprendizagem.',
    instructor: 'Prof. de TI Renato Souza',
    duration: '1h 40min',
    totalLessons: 5,
    modules: [
      {
        id: 'cb-03-m1', title: 'Tecnologia Assistiva Digital',
        lessons: [
          { id: 'cb-03-l1', title: 'Configurações de acessibilidade no Windows/Mac', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-03-l2', title: 'Extensões de navegador para daltonismo', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-03-l3', title: 'Apps de simulação e filtragem de cores', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-03-l4', title: 'Configurando o ambiente digital da sala', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'cb-03-l5', title: 'Avaliando plataformas educacionais', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },

  // ── INCLUSÃO GERAL ───────────────────────────────────────────
  {
    id: 'inc-01',
    trailId: 'inclusion',
    title: 'Fundamentos da Educação Inclusiva',
    description: 'Os pilares legais, éticos e pedagógicos da educação inclusiva no Brasil e como aplicá-los no cotidiano escolar.',
    instructor: 'Especialista em Ed. Especial Dra. Beatriz Oliveira',
    duration: '3h 30min',
    totalLessons: 13,
    modules: [
      {
        id: 'inc-01-m1', title: 'Marco Legal e Filosófico',
        lessons: [
          { id: 'inc-01-l1', title: 'Legislação brasileira: LDB, LBI e PNEE', duration: '25min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l2', title: 'Declaração de Salamanca e seus impactos', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l3', title: 'Inclusão vs. integração: qual a diferença?', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l4', title: 'O papel do professor na educação inclusiva', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'inc-01-m2', title: 'Prática em Sala de Aula',
        lessons: [
          { id: 'inc-01-l5', title: 'Diferenciação pedagógica universal', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l6', title: 'Desenho Universal para Aprendizagem (DUA)', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l7', title: 'Plano Educacional Individualizado (PEI)', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l8', title: 'Colaboração entre professores e especialistas', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l9', title: 'Avaliação inclusiva: múltiplas formas', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l10', title: 'Sala de recursos multifuncionais', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l11', title: 'Família como parceira na inclusão', duration: '15min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l12', title: 'Combatendo o capacitismo na escola', duration: '17min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-01-l13', title: 'Construindo uma escola para todos', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'inc-02',
    trailId: 'inclusion',
    title: 'Comunicação Alternativa e Aumentativa',
    description: 'Recursos e estratégias de CAA para alunos com dificuldades de comunicação verbal, incluindo uso de pictogramas e tecnologia.',
    instructor: 'Fonoaudióloga Patrícia Gomes',
    duration: '2h 40min',
    totalLessons: 9,
    modules: [
      {
        id: 'inc-02-m1', title: 'Introdução à CAA',
        lessons: [
          { id: 'inc-02-l1', title: 'O que é Comunicação Alternativa e Aumentativa', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l2', title: 'Sistemas de símbolos e pictogramas', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l3', title: 'Pranchas de comunicação: como criar', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l4', title: 'Apps de CAA: visão geral', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l5', title: 'Implementando CAA na sala de aula', duration: '24min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l6', title: 'Treinando a equipe escolar em CAA', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l7', title: 'CAA para alunos com TEA', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l8', title: 'CAA para alunos com paralisia cerebral', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-02-l9', title: 'Avaliando o progresso com CAA', duration: '26min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'inc-03',
    trailId: 'inclusion',
    title: 'Sala de Aula para Todos: Clima e Cultura',
    description: 'Como construir uma cultura de sala de aula verdadeiramente inclusiva, onde cada aluno se sente pertencente e valorizado.',
    instructor: 'Prof. Antônio Carvalho',
    duration: '2h 20min',
    totalLessons: 8,
    modules: [
      {
        id: 'inc-03-m1', title: 'Clima e Pertencimento',
        lessons: [
          { id: 'inc-03-l1', title: 'O que é sentimento de pertencimento', duration: '18min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l2', title: 'Rotinas que acolhem a diversidade', duration: '20min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l3', title: 'Tratando diferenças com naturalidade', duration: '17min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l4', title: 'Trabalho colaborativo e pares de apoio', duration: '22min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l5', title: 'Resolução de conflitos de forma inclusiva', duration: '19min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l6', title: 'Combatendo bullying relacionado à deficiência', duration: '21min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l7', title: 'Celebrando a neurodiversidade', duration: '16min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'inc-03-l8', title: 'Plano de ação para a escola inclusiva', duration: '27min', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
    ],
  },
]

// Helpers
export function getTrailById(id) {
  return TRAILS.find(t => t.id === id)
}

export function getCourseById(id) {
  return COURSES.find(c => c.id === id)
}

export function getCoursesByTrail(trailId) {
  return COURSES.filter(c => c.trailId === trailId)
}

export function getLessonById(courseId, lessonId) {
  const course = getCourseById(courseId)
  if (!course) return null
  for (const mod of course.modules) {
    const lesson = mod.lessons.find(l => l.id === lessonId)
    if (lesson) return { lesson, module: mod, course }
  }
  return null
}

export function getAdjacentLessons(courseId, lessonId) {
  const course = getCourseById(courseId)
  if (!course) return { prev: null, next: null }
  const allLessons = course.modules.flatMap(m => m.lessons)
  const idx = allLessons.findIndex(l => l.id === lessonId)
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  }
}


import { Subject, Exam, Tip } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'adm-geral',
    name: 'Administração Geral',
    icon: 'fa-sitemap',
    description: 'Princípios da administração, gestão de pessoas e materiais.',
    topics: []
  },
  {
    id: 'adm-publica',
    name: 'Administração Pública',
    icon: 'fa-building-columns',
    description: 'Gestão pública, governança e políticas públicas.',
    topics: []
  },
  {
    id: 'arquivologia',
    name: 'Arquivologia',
    icon: 'fa-box-archive',
    description: 'Gestão de documentos e arquivos.',
    topics: []
  },
  {
    id: 'bancarios',
    name: 'Conhecimentos Bancários',
    icon: 'fa-money-check-dollar',
    description: 'Sistema financeiro nacional e produtos bancários.',
    topics: []
  },
  {
    id: 'contabilidade',
    name: 'Contabilidade',
    icon: 'fa-calculator',
    description: 'Contabilidade geral e pública.',
    topics: []
  },
  {
    id: 'ctb',
    name: 'CTB - Legislação de Trânsito',
    icon: 'fa-car',
    description: 'Código de Trânsito Brasileiro e resoluções do CONTRAN.',
    topics: []
  },
  {
    id: 'dir-adm',
    name: 'Direito Administrativo',
    icon: 'fa-landmark',
    description: 'Atos administrativos, licitações e regime jurídico único.',
    topics: ['Atos Administrativos', 'Licitações 14.133', 'Poderes Administrativos', 'Agentes Públicos']
  },
  {
    id: 'dir-civil',
    name: 'Direito Civil',
    icon: 'fa-scale-balanced',
    description: 'Pessoas, bens e fatos jurídicos.',
    topics: []
  },
  {
    id: 'dir-const',
    name: 'Direito Constitucional',
    icon: 'fa-gavel',
    description: 'Constituição Federal de 1988 e princípios fundamentais.',
    topics: ['Direitos Fundamentais', 'Organização do Estado', 'Poder Executivo', 'Poder Legislativo']
  },
  {
    id: 'dir-militar',
    name: 'Direito Militar',
    icon: 'fa-person-military-rifle',
    description: 'Código Penal Militar e Processo Penal Militar.',
    topics: []
  },
  {
    id: 'dir-penal',
    name: 'Direito Penal',
    icon: 'fa-handcuffs',
    description: 'Crimes, penas e teoria do delito.',
    topics: []
  },
  {
    id: 'dir-prev',
    name: 'Direito Previdenciário',
    icon: 'fa-piggy-bank',
    description: 'Seguridade social, RGPS e benefícios.',
    topics: []
  },
  {
    id: 'dir-proc-civil',
    name: 'Direito Processual Civil',
    icon: 'fa-book-bookmark',
    description: 'Processo civil, recursos e execução.',
    topics: []
  },
  {
    id: 'dir-proc-penal',
    name: 'Direito Processual Penal',
    icon: 'fa-magnifying-glass',
    description: 'Inquérito, ação penal e provas.',
    topics: []
  },
  {
    id: 'dir-humanos',
    name: 'Direitos Humanos',
    icon: 'fa-hands-holding-child',
    description: 'Declaração Universal e tratados internacionais.',
    topics: []
  },
  {
    id: 'eca',
    name: 'ECA - Estatuto da Criança e Adolescente',
    icon: 'fa-child-reaching',
    description: 'Lei 8.069/90 e proteção integral.',
    topics: []
  },
  {
    id: 'economia',
    name: 'Economia',
    icon: 'fa-chart-line',
    description: 'Microeconomia, macroeconomia e finanças públicas.',
    topics: []
  },
  {
    id: 'enfermagem',
    name: 'Enfermagem',
    icon: 'fa-user-nurse',
    description: 'Fundamentos de enfermagem e saúde pública.',
    topics: []
  },
  {
    id: 'esp',
    name: 'Espanhol',
    icon: 'fa-language',
    description: 'Gramática e interpretação de textos em espanhol.',
    topics: []
  },
  {
    id: 'estatistica',
    name: 'Estatística',
    icon: 'fa-chart-simple',
    description: 'Estatística descritiva e inferencial.',
    topics: []
  },
  {
    id: 'fisica',
    name: 'Física',
    icon: 'fa-atom',
    description: 'Mecânica, termodinâmica e eletromagnetismo.',
    topics: []
  },
  {
    id: 'geo',
    name: 'Geografia',
    icon: 'fa-earth-americas',
    description: 'Geografia geral, do Brasil e geopolítica.',
    topics: []
  },
  {
    id: 'hist',
    name: 'História',
    icon: 'fa-monument',
    description: 'História geral e do Brasil.',
    topics: []
  },
  {
    id: 'info',
    name: 'Informática',
    icon: 'fa-laptop-code',
    description: 'Sistemas operacionais, redes e segurança da informação.',
    topics: ['Windows/Linux', 'Navegadores', 'Segurança', 'Pacote Office']
  },
  {
    id: 'ingles',
    name: 'Inglês',
    icon: 'fa-language',
    description: 'Compreensão de textos e gramática inglesa.',
    topics: []
  },
  {
    id: 'leis-ext',
    name: 'Leis Extravagantes',
    icon: 'fa-scale-balanced',
    description: 'Legislação penal especial e leis complementares.',
    topics: []
  },
  {
    id: 'matematica',
    name: 'Matemática',
    icon: 'fa-calculator',
    description: 'Aritmética, geometria e funções.',
    topics: []
  },
  {
    id: 'pedagogia',
    name: 'Pedagogia',
    icon: 'fa-school',
    description: 'Legislação educacional e teorias pedagógicas.',
    topics: []
  },
  {
    id: 'port',
    name: 'Português',
    icon: 'fa-book-open',
    description: 'Gramática, interpretação de texto e redação oficial.',
    topics: ['Sintaxe', 'Morfologia', 'Pontuação', 'Acentuação', 'Concordância']
  },
  {
    id: 'quimica',
    name: 'Química',
    icon: 'fa-flask',
    description: 'Química geral, orgânica e inorgânica.',
    topics: []
  },
  {
    id: 'rlm',
    name: 'Raciocínio Lógico',
    icon: 'fa-brain',
    description: 'Lógica sentencial, matemática básica e sequências.',
    topics: ['Proposições', 'Tabelas Verdade', 'Conjuntos', 'Probabilidade']
  },
  {
    id: 'sus',
    name: 'SUS - Sistema Único de Saúde',
    icon: 'fa-hospital-user',
    description: 'História, princípios e legislação do SUS.',
    topics: []
  }
];

export const EXAMS: Exam[] = [
  { id: '1', institution: 'INSS', role: 'Técnico do Seguro Social', year: 2024, level: 'Médio', status: 'Aberto' },
  { id: '1-old', institution: 'INSS', role: 'Técnico do Seguro Social', year: 2022, level: 'Médio', status: 'Finalizado' },
  { id: '2', institution: 'Banco do Brasil', role: 'Escriturário', year: 2023, level: 'Médio', status: 'Finalizado' },
  { id: '3', institution: 'Polícia Federal', role: 'Agente Administrativo', year: 2024, level: 'Superior', status: 'Previsto' },
  { id: '4', institution: 'Caixa Econômica', role: 'Técnico Bancário', year: 2024, level: 'Médio', status: 'Aberto' },
  { id: '4-old', institution: 'Caixa Econômica', role: 'Técnico Bancário', year: 2021, level: 'Médio', status: 'Finalizado' },
  { id: '4-very-old', institution: 'Caixa Econômica', role: 'Técnico Bancário', year: 2014, level: 'Médio', status: 'Finalizado' }
];

export const TIPS: Tip[] = [
  {
    id: 't1',
    title: 'A Técnica Pomodoro nos Estudos',
    category: 'Produtividade',
    summary: 'Como gerenciar seu tempo de forma eficaz usando blocos de 25 minutos.',
    content: 'O Pomodoro ajuda a manter o foco...'
  },
  {
    id: 't2',
    title: 'Ciclo de Estudos vs Cronograma',
    category: 'Estratégia',
    summary: 'Entenda qual o melhor método para sua rotina de concurseiro.',
    content: 'Ciclos de estudo permitem maior flexibilidade...'
  },
  {
    id: 't3',
    title: 'Revisões Espaçadas',
    category: 'Memorização',
    summary: 'A chave para não esquecer o conteúdo estudado na semana passada.',
    content: 'Revise em 24h, 7 dias e 30 dias...'
  }
];

export const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

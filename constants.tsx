
import { Subject, Exam, Tip } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'port',
    name: 'Língua Portuguesa',
    icon: 'fa-book-open',
    description: 'Gramática, interpretação de texto e redação oficial.',
    topics: ['Sintaxe', 'Morfologia', 'Pontuação', 'Acentuação', 'Concordância']
  },
  {
    id: 'dir-const',
    name: 'Direito Constitucional',
    icon: 'fa-gavel',
    description: 'Constituição Federal de 1988 e princípios fundamentais.',
    topics: ['Direitos Fundamentais', 'Organização do Estado', 'Poder Executivo', 'Poder Legislativo']
  },
  {
    id: 'rlm',
    name: 'Raciocínio Lógico',
    icon: 'fa-brain',
    description: 'Lógica sentencial, matemática básica e sequências.',
    topics: ['Proposições', 'Tabelas Verdade', 'Conjuntos', 'Probabilidade']
  },
  {
    id: 'info',
    name: 'Informática',
    icon: 'fa-laptop-code',
    description: 'Sistemas operacionais, redes e segurança da informação.',
    topics: ['Windows/Linux', 'Navegadores', 'Segurança', 'Pacote Office']
  },
  {
    id: 'dir-adm',
    name: 'Direito Administrativo',
    icon: 'fa-landmark',
    description: 'Atos administrativos, licitações e regime jurídico único.',
    topics: ['Atos Administrativos', 'Licitações 14.133', 'Poderes Administrativos', 'Agentes Públicos']
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

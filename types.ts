
export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: string[];
  description: string;
}

export interface Exam {
  id: string;
  institution: string;
  role: string;
  year: number;
  level: 'Fundamental' | 'Médio' | 'Superior';
  status: 'Aberto' | 'Finalizado' | 'Previsto';
}

export interface Tip {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

export interface StudyBlock {
  id: string;
  subjectId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category: 'Estudo' | 'Saúde' | 'Revisão';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}


import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const SubjectSection: React.FC = () => {
    const subjects = [
        "Administração Geral", "Administração Pública", "Arquivologia", "Conhecimentos Bancários",
        "Contabilidade", "CTB – Legislação de Trânsito", "Direito Administrativo", "Direito Constitucional",
        "Direito Civil", "Direito Penal", "Direito Processual Civil", "Direito Processual Penal",
        "Direito Previdenciário", "Direito Militar", "Direitos Humanos", "ECA", "Economia",
        "Enfermagem", "Estatística", "Física", "Química", "Geografia", "História", "Informática",
        "Inglês", "Espanhol", "Legislação Extravagante", "Matemática", "Raciocínio Lógico",
        "Pedagogia", "Português", "SUS – Sistema Único de Saúde"
    ];

    return (
        <section id="materias" className="py-20 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-500/10 -skew-x-12 translate-x-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-12">
                    <span className="text-sky-400 font-bold tracking-widest uppercase text-sm">CONTEÚDO COMPLETO</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mt-2">Mais de 30 Matérias <span className="text-sky-400 underline decoration-sky-400/30">Mapeadas</span></h2>
                    <p className="text-slate-400 mt-4 max-w-2xl text-lg">
                        Apostilas teóricas + Questões de fixação em PDF para cobrir 100% do edital dos principais concursos do Brasil.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {subjects.map((subject, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors group"
                        >
                            <div className="bg-sky-500/20 text-sky-400 p-1.5 rounded-lg group-hover:bg-sky-500 group-hover:text-white transition-all">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-slate-100">{subject}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-400">
                        <div className="bg-slate-900 px-8 py-4 rounded-xl">
                            <p className="text-slate-300 font-medium">E muito mais conteúdos atualizados mensalmente!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

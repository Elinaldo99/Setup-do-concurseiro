
import React from 'react';
import { Video, BookOpen, Download, Brain, Flame, Target, Share2, Library } from 'lucide-react';

export const StudyResources: React.FC = () => {
    const resources = [
        {
            icon: <Video className="h-7 w-7" />,
            title: "Videoaulas por Assunto",
            desc: "Navegue por tópicos específicos com vídeos explicativos integrados para cada matéria.",
            color: "bg-blue-600"
        },
        {
            icon: <BookOpen className="h-7 w-7" />,
            title: "Apostilas em PDF",
            desc: "Conteúdo denso e organizado em formato PDF. Tudo disponível para baixar e estudar onde quiser.",
            color: "bg-indigo-600"
        },
        {
            icon: <Download className="h-7 w-7" />,
            title: "Materiais Baixáveis",
            desc: "Baixe PDFs de provas anteriores, exercícios e simulados para estudar offline.",
            color: "bg-emerald-600"
        },
        {
            icon: <Brain className="h-7 w-7" />,
            title: "Mapas Mentais PRO",
            desc: "Visualize a matéria de forma lógica. Mapas mentais diagramados para alta retenção.",
            color: "bg-purple-600"
        },
        {
            icon: <Flame className="h-7 w-7" />,
            title: "Dicas & Estratégia",
            desc: "Módulo exclusivo de mentoria sobre foco, motivação e como hackear sua rotina.",
            color: "bg-orange-600"
        },
        {
            icon: <Target className="h-7 w-7" />,
            title: "Questões em PDF",
            desc: "Treine com milhares de questões reais organizadas em cadernos PDF por banca e ano.",
            color: "bg-rose-600"
        }
    ];

    return (
        <section id="recursos" className="py-24 bg-slate-900 overflow-hidden relative">
            {/* Decorative gradient background */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center space-x-2 text-indigo-400 font-bold mb-4">
                        <Library className="h-5 w-5" />
                        <span className="uppercase tracking-[0.2em] text-sm">Ecossistema Completo</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mt-2">
                        Acesso <span className="text-indigo-500">Ilimitado</span> a Tudo <br className="hidden md:block" /> que Você Precisa.
                    </h2>
                    <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
                        Um ambiente pré-moldado onde o conteúdo é entregue de forma mastigada, facilitando sua jornada do zero à nomeação.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((res, i) => (
                        <div key={i} className="bg-slate-800/40 p-10 rounded-[3rem] border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30 transition-all group backdrop-blur-sm">
                            <div className={`${res.color} text-white p-5 rounded-3xl w-fit mb-8 shadow-2xl group-hover:scale-110 transition-transform`}>
                                {res.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-400 transition-colors">{res.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-lg">{res.desc}</p>

                            <div className="mt-8 pt-6 border-t border-slate-700/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-indigo-400 font-bold text-sm">Disponível no Site</span>
                                <Share2 className="h-4 w-4 text-slate-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

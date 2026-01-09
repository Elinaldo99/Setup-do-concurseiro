
import React from 'react';
import { WifiOff, Layout, Zap, Target, BookOpenCheck, MousePointer2 } from 'lucide-react';

export const Benefits: React.FC = () => {
    const benefits = [
        {
            icon: <MousePointer2 className="h-8 w-8 text-sky-600" />,
            title: "Tudo Pronto em 1 Clique",
            description: "Esqueça perder tempo organizando pastas. O Setup já vem com toda a estrutura necessária para você só sentar e estudar."
        },
        {
            icon: <Layout className="h-8 w-8 text-sky-600" />,
            title: "Ambiente Pré-Moldado",
            description: "Dashboard intuitiva inspirada nas melhores plataformas de SaaS do mundo. Foco total no que importa."
        },
        {
            icon: <Zap className="h-8 w-8 text-sky-600" />,
            title: "Estratégias de Aprovação",
            description: "Conteúdo focado na 'Regra de Pareto': aprenda os 20% de conteúdo que geram 80% dos seus resultados nas provas."
        },
        {
            icon: <BookOpenCheck className="h-8 w-8 text-sky-600" />,
            title: "Acadêmico & Concursos",
            description: "Material versátil que serve tanto para quem está na faculdade quanto para quem busca o cargo público dos sonhos."
        }
    ];

    return (
        <section id="vantagens" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Por que escolher o <span className="text-sky-600">Setup?</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Não entregamos apenas arquivos. Entregamos um <b>sistema de sucesso</b> testado por milhares de estudantes aprovados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {benefits.map((benefit, index) => (
                        <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-white transition-all shadow-sm hover:shadow-2xl hover:-translate-y-2 group">
                            <div className="mb-8 p-5 bg-white rounded-3xl shadow-sm inline-block group-hover:bg-sky-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                {benefit.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{benefit.title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


import React from 'react';
import { Target, Zap, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

export const BonusSection: React.FC = () => {
    const steps = [
        {
            icon: <Target className="h-8 w-8 text-white" />,
            title: "1. Mapeamento",
            desc: "Identificamos os 20% do conteúdo que representam 80% das questões da sua banca.",
            color: "bg-indigo-600"
        },
        {
            icon: <Zap className="h-8 w-8 text-white" />,
            title: "2. Estudo Ativo",
            desc: "Videoaulas e resumos focados apenas no que é cobrado, sem enrolação teórica.",
            color: "bg-purple-600"
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-white" />,
            title: "3. Treino Massivo",
            desc: "Resolução de questões com nossa dashboard de performance em tempo real.",
            color: "bg-emerald-600"
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-white" />,
            title: "4. Blindagem",
            desc: "Revisões sistemáticas com mapas mentais para travar o conteúdo na memória.",
            color: "bg-rose-600"
        }
    ];

    return (
        <section id="brindes" className="py-24 bg-white overflow-hidden relative">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full mb-6 font-black text-xs uppercase tracking-widest">
                        <BarChart3 className="h-4 w-4" />
                        <span>Engenharia da Aprovação</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        A Metodologia que <span className="text-indigo-600">Acelera</span> <br className="hidden md:block" /> sua Nomeação em até 3x.
                    </h2>
                    <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg font-medium">
                        Não é sorte, é processo. O Setup guia você por cada fase do aprendizado, garantindo que você chegue na prova com segurança total.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Linha conectora escondida no mobile */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 translate-y-[-2rem]"></div>

                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-indigo-200 hover:shadow-[0_30px_60px_rgba(79,70,229,0.1)] transition-all duration-500 group flex flex-col items-center text-center"
                        >
                            {/* Número do Passo */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-50 flex items-center justify-center font-black text-indigo-600 z-20">
                                0{idx + 1}
                            </div>

                            <div className={`${step.color} w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                {step.icon}
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                {step.title}
                            </h3>

                            <p className="text-slate-500 leading-relaxed font-medium text-sm">
                                {step.desc}
                            </p>

                            {/* Seta indicativa para o próximo passo (apenas desktop) */}
                            {idx < 3 && (
                                <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-[2rem] z-20 text-slate-200">
                                    <ArrowRight className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-4 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all cursor-pointer group">
                        <span className="font-black text-sm uppercase tracking-widest">Ver demonstração do método</span>
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:translate-x-2 transition-transform">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

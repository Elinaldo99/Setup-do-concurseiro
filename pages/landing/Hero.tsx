
import React from 'react';
import { ChevronRight, ShieldCheck, Monitor, AppWindow } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-white">
            {/* Background patterns */}
            {/* Fix: Corrected 'size' to 'backgroundSize' in the style object as 'size' is not a valid CSS property in React style objects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 bg-sky-600 text-white px-4 py-1.5 rounded-full mb-8 font-bold text-xs uppercase tracking-widest shadow-lg shadow-sky-200">
                            <Monitor className="h-4 w-4" />
                            <span>Ambiente de Estudos 2.0</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                            Sua Sala de <br />Estudos <span className="text-sky-600">Particular.</span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Não é apenas um conteúdo. O <b>Setup do Concurseiro</b> é uma plataforma completa com videoaulas, simulados, mapas mentais e <b>apostilas em PDF</b>. Tudo pré-moldado para sua aprovação.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <a
                                href="#preco"
                                className="w-full sm:w-auto bg-sky-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-sky-700 transition-all transform hover:scale-105 shadow-2xl shadow-sky-200 flex items-center justify-center space-x-3"
                            >
                                <span>ENTRAR NA PLATAFORMA</span>
                                <ChevronRight className="h-6 w-6" />
                            </a>
                            <div className="flex items-center space-x-2 text-slate-400 font-semibold uppercase text-xs tracking-tighter">
                                <AppWindow className="h-4 w-4" />
                                <span>Acesso imediato via Dashboard</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8 border-t border-slate-100 pt-8">
                            <div>
                                <p className="text-2xl font-black text-slate-900">+100k</p>
                                <p className="text-sm text-slate-500 font-medium">Questões em PDF</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">30+</p>
                                <p className="text-sm text-slate-500 font-medium">Matérias</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">24/7</p>
                                <p className="text-sm text-slate-500 font-medium">Acesso Online</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full">
                        {/* Mockup of a Dashboard Environment */}
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[8px] border-slate-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center space-x-2 mb-4 px-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <div className="ml-4 h-4 w-32 bg-slate-800 rounded"></div>
                            </div>
                            <div className="bg-slate-800 rounded-2xl p-6 aspect-video flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop"
                                    alt="Interface"
                                    className="w-full h-full object-cover rounded-xl opacity-60"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                    </div>
                                    <p className="text-white font-bold text-xl">Aula: Estratégias de Estudo</p>
                                    <p className="text-sky-400 font-medium">Módulo 01 - Introdução</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="h-16 bg-slate-800 rounded-xl flex items-center px-4 space-x-3">
                                    <div className="w-8 h-8 bg-sky-500/20 rounded flex items-center justify-center">
                                        <Monitor className="h-4 w-4 text-sky-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-700 rounded"></div>
                                </div>
                                <div className="h-16 bg-slate-800 rounded-xl flex items-center px-4 space-x-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded flex items-center justify-center">
                                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-slate-700 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block animate-bounce-slow">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <span className="text-green-600 font-black">98%</span>
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-sm">Taxa de Foco</p>
                                    <p className="text-slate-500 text-xs">Aumentada com o Setup</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

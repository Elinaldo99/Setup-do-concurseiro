
import React from 'react';
import { Calendar, Clock, Edit3, CheckSquare, ListChecks, Wand2 } from 'lucide-react';

export const SchedulesSection: React.FC = () => {
    return (
        <section id="cronogramas" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 relative order-2 lg:order-1">
                        <div className="bg-white rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-blue-400"></div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                        <Calendar className="text-sky-600 h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="text-slate-900 font-black block">Planner Inteligente</span>
                                        <span className="text-slate-400 text-xs font-bold uppercase">Dashboard 2024</span>
                                    </div>
                                </div>
                                <button className="bg-sky-600 text-white p-2 rounded-lg hover:bg-sky-700 transition-colors">
                                    <Edit3 size={18} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { day: 'Segunda', task: 'Direito Adm: Atos Administrativos', color: 'bg-sky-500' },
                                    { day: 'Terça', task: 'Português: Sintaxe do Período', color: 'bg-emerald-500' },
                                    { day: 'Quarta', task: 'Matemática: Probabilidade', color: 'bg-rose-500' },
                                ].map((item, idx) => (
                                    <div key={idx} className="group flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                        <div className={`w-1.5 h-10 rounded-full ${item.color} mr-4`}></div>
                                        <div className="flex-1">
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{item.day}</p>
                                            <p className="text-slate-900 font-extrabold text-sm">{item.task}</p>
                                        </div>
                                        <CheckSquare className="text-slate-200 group-hover:text-sky-500 h-6 w-6 transition-colors" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 bg-sky-50 rounded-2xl p-6 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Wand2 className="text-sky-600 h-5 w-5" />
                                    <span className="text-sky-900 font-bold text-sm">Gerar plano automático?</span>
                                </div>
                                <button className="bg-white text-sky-600 font-black text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                                    CLIQUE AQUI
                                </button>
                            </div>
                        </div>

                        {/* Background pattern for depth */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sky-600/5 rounded-full blur-[120px] -z-10"></div>
                    </div>

                    <div className="flex-1 order-1 lg:order-2">
                        <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-4 py-2 rounded-full mb-8 font-black text-xs uppercase tracking-[0.1em]">
                            <Clock className="h-4 w-4" />
                            <span>Cronogramas de Elite</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8">
                            Sua Rotina <span className="text-sky-600">Automatizada.</span>
                        </h2>
                        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                            Diga adeus à paralisia da escolha. Tenha acesso a <b>Cronogramas Prontos</b> para cada edital ou use nossa ferramenta para criar o seu plano personalizado em segundos.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-sky-600 h-14 w-14 rounded-3xl flex items-center justify-center shadow-xl shadow-sky-200">
                                    <ListChecks className="text-white h-7 w-7" />
                                </div>
                                <h4 className="text-xl font-black text-slate-900">Planos Por Edital</h4>
                                <p className="text-slate-500 font-medium">Cronogramas pré-moldados para PF, PRF, Tribunais, INSS e centenas de prefeituras.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-sky-600 h-14 w-14 rounded-3xl flex items-center justify-center shadow-xl shadow-sky-200">
                                    <Wand2 className="text-white h-7 w-7" />
                                </div>
                                <h4 className="text-xl font-black text-slate-900">Personalizador</h4>
                                <p className="text-slate-500 font-medium">Ajuste seu estudo conforme suas horas vagas, vida social e nível de conhecimento.</p>
                            </div>
                        </div>

                        <div className="mt-12 inline-flex items-center space-x-3 text-sky-600 font-black text-sm group cursor-pointer">
                            <span>VER EXEMPLOS DE CRONOGRAMAS</span>
                            <div className="h-px w-8 bg-sky-600 group-hover:w-12 transition-all"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

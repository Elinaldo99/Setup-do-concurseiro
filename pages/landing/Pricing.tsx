
import React from 'react';
import { Check, Rocket, ShieldCheck, Zap, Star, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
    return (
        <section id="preco" className="py-24 relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-yellow-400 text-slate-900 px-4 py-1.5 rounded-full mb-4 font-black text-xs uppercase tracking-widest shadow-md">
                        <Zap className="h-4 w-4 fill-slate-900" />
                        <span>Oferta por tempo limitado</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900">
                        Acesso <span className="text-sky-600 italic">Ilimitado</span> ao Setup.
                    </h2>
                    <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Um investimento simbólico para ter todas as ferramentas de aprovação na palma da sua mão.
                        Sem letras miúdas, apenas o que você precisa para passar.
                    </p>
                </div>

                <div className="bg-[#101424] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row relative border border-slate-800">
                    {/* Lado Esquerdo - Recursos */}
                    <div className="p-8 md:p-16 lg:p-20 flex-1 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-10">
                            O que está <span className="text-sky-400 italic">incluído:</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                            {[
                                "Hub de Videoaulas Integrado",
                                "Apostilas e Resumos Digitais",
                                "Banco de 100k+ Questões",
                                "Cronogramas Personalizáveis",
                                "Mapas Mentais em Alta Definição",
                                "Acervo de Provas Anteriores",
                                "Módulo de Foco & Motivação",
                                "Suporte Premium via Dashboard"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 group">
                                    <div className="bg-sky-500/20 rounded-full p-1 shrink-0">
                                        <Check className="h-4 w-4 text-sky-400 group-hover:scale-125 transition-transform" />
                                    </div>
                                    <span className="text-slate-300 font-bold text-sm tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-sky-500/5 p-6 md:p-8 rounded-3xl border border-sky-500/10">
                            <div className="flex items-center space-x-2 mb-3">
                                <Star className="text-yellow-400 fill-yellow-400 h-5 w-5" />
                                <span className="text-white font-black uppercase text-xs tracking-widest">Bônus Especial de Hoje</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Garante o <b>Planner de Estudos 2024</b> e acesso a todas as novas atualizações de editais sem custo adicional durante o período.
                            </p>
                        </div>
                    </div>

                    {/* Lado Direito - Preço e Justificativa */}
                    <div className="bg-sky-600 p-10 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        {/* Discount Badge */}
                        <div className="absolute top-8 right-8 bg-yellow-400 text-slate-900 font-black px-4 py-2 rounded-xl text-xs rotate-12 shadow-xl z-20">
                            -70% OFF
                        </div>

                        <div className="relative z-10 w-full max-w-sm">
                            <p className="text-sky-100 font-bold uppercase tracking-[0.2em] text-xs mb-4">Plano Semestral</p>

                            <div className="mb-8">
                                <p className="text-sky-200 line-through text-xl font-bold opacity-60">R$ 97,00</p>
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="text-white text-3xl font-black self-start mt-4">R$</span>
                                    <span className="text-white text-7xl md:text-8xl font-black">29,90</span>
                                </div>
                                <p className="text-sky-100 font-bold text-lg mt-2">pago a cada 6 meses</p>
                            </div>

                            <Link
                                to="/auth"
                                className="block w-full bg-white hover:bg-slate-50 text-sky-600 font-black py-5 rounded-2xl text-xl transition-all shadow-2xl transform hover:-translate-y-1 active:scale-95 group mb-8"
                            >
                                <span className="flex items-center justify-center space-x-3">
                                    <span>QUERO MEU ACESSO AGORA</span>
                                    <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </Link>

                            {/* Justificativa do Valor */}
                            <div className="bg-sky-700/30 backdrop-blur-sm p-5 rounded-2xl border border-white/10 text-left mb-8">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Coffee className="text-white h-4 w-4" />
                                    <span className="text-white font-bold text-xs uppercase">Por que este valor?</span>
                                </div>
                                <p className="text-sky-100 text-xs leading-relaxed">
                                    O valor de <b>R$ 29,90 semestral</b> equivale a menos de 5 reais por mês. Escolhemos esse modelo para tornar o estudo de elite acessível a todos e manter nossa plataforma sempre atualizada com os novos editais que saem toda semana.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-center space-x-2 text-white font-bold text-xs opacity-80">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Ambiente Seguro - Checkout Criptografado</span>
                                </div>

                                <div className="flex justify-center items-center space-x-6">
                                    <span className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Pague com</span>
                                    <div className="flex space-x-4 opacity-80 grayscale brightness-200">
                                        <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-logo-2.png" className="h-4" alt="Pix" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

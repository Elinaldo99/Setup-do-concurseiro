
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Ana Beatriz",
        role: "Aprovada - PM-SP",
        content: "O Setup do Concurseiro mudou meu jogo. Eu perdia horas tentando montar um cronograma, mas com o Setup já estava tudo pronto. Os mapas mentais foram o diferencial na minha revisão final!",
        image: "https://picsum.photos/seed/ana/100/100"
    },
    {
        name: "Carlos Eduardo",
        role: "Estudante de Direito",
        content: "Comprei para a faculdade e me surpreendi. A organização das pastas é impecável. É literalmente um setup de estudos pronto no seu computador. Vale cada centavo.",
        image: "https://picsum.photos/seed/carlos/100/100"
    },
    {
        name: "Juliana Silva",
        role: "Aprovada - Pref. Curitiba",
        content: "As questões comentadas me ajudaram a entender o estilo da banca Vunesp. Ter esse Setup offline no meu tablet transformou meu deslocamento em tempo de aprovação.",
        image: "https://picsum.photos/seed/juli/100/100"
    },
    {
        name: "Ricardo Mendes",
        role: "Concurseiro Bancário",
        content: "Conhecimentos Bancários e Português estão perfeitos. O Setup do Concurseiro é o acervo mais completo que já comprei. O suporte também é excelente.",
        image: "https://picsum.photos/seed/ricardo/100/100"
    }
];

export const Testimonials: React.FC = () => {
    return (
        <section id="depoimentos" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                        Resultados Reais de quem <span className="text-indigo-600">atestou!</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Mais do que material, entregamos um sistema de estudo completo que gera resultados.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group relative overflow-hidden"
                        >
                            <Quote className="absolute top-6 right-8 h-12 w-12 text-indigo-200/50 group-hover:text-indigo-300/50 transition-colors" />

                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-slate-700 text-lg leading-relaxed italic mb-8 relative z-10">
                                "{t.content}"
                            </p>

                            <div className="flex items-center space-x-4">
                                <img
                                    src={t.image}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                                    <p className="text-indigo-600 font-semibold text-sm">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-slate-900 rounded-[3rem] p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Pronto para montar o seu Setup?</h3>
                        <p className="text-slate-400 mb-8 text-lg">A aprovação começa com a organização certa.</p>
                        <a
                            href="#preco"
                            className="inline-block bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-indigo-500/20"
                        >
                            QUERO MEU SETUP AGORA
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

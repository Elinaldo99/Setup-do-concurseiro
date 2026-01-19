
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ: React.FC = () => {
    const faqs = [
        {
            q: "O material é digital ou físico?",
            a: "O material é 100% digital em formato PDF e Links Externos. Você recebe acesso imediato após a compra. Menciona-se 'Vantagens do Pendrive' pois o material é otimizado para que você possa salvar em um pendrive ou HD externo e estudar offline."
        },
        {
            q: "Como recebo o acesso?",
            a: "Assim que o pagamento for confirmado, você será redirecionada para area de login de acesso e terá todas as informações lá."
        },
        {
            q: "O material serve para qualquer concurso?",
            a: "Sim! Cobrimos as principais matérias que caem em 95% dos editais do Brasil (Administrativo, Constitucional, Português, RLM, etc), além de áreas específicas como Saúde, Educação e Direito."
        },
        {
            q: "As apostilas em PDF estão atualizadas?",
            a: "Sim, todo o acervo foi revisado e atualizado em 2024 de acordo com as legislações vigentes e jurisprudências mais recentes."
        }
    ];

    return (
        <section id="faq" className="py-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-black text-center text-slate-900 mb-12">Dúvidas Frequentes</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// Fixed: Defined FaqItem using React.FC to correctly handle standard React attributes like 'key' in JSX.
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
            >
                <span className="text-lg font-bold text-slate-800">{question}</span>
                {isOpen ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-slate-400" />}
            </button>
            {isOpen && (
                <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-slate-50/50">
                    {answer}
                </div>
            )}
        </div>
    );
};

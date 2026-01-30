
import React from 'react';
import { Facebook, GraduationCap, Instagram, Mail, MessageCircle } from 'lucide-react';

export const LandingFooter: React.FC = () => {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
            elem.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-sky-600 p-2 rounded-xl">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Setup do <span className="text-sky-500">Concurseiro</span>
                            </span>
                        </div>
                        <p className="max-w-md mb-8 text-slate-400 leading-relaxed">
                            O Setup do Concurseiro é a maior plataforma de organização e materiais em PDF para estudantes que buscam performance e resultados reais em concursos e na vida acadêmica.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/profile.php?id=61585865818712" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-xl hover:text-white hover:bg-sky-600 transition-all"><Facebook size={20} /></a>
                            <a href="https://t.me/setupdoconcurseiro" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 rounded-xl hover:text-white hover:bg-sky-600 transition-all"><MessageCircle size={20} /></a>
                            <a href="mailto:setupdoconcurseiro@gmail.com" className="p-3 bg-slate-800 rounded-xl hover:text-white hover:bg-sky-600 transition-all"><Mail size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Navegação</h4>
                        <ul className="space-y-4">
                            <li><a href="#vantagens" onClick={(e) => scrollToSection(e, '#vantagens')} className="hover:text-sky-400 transition-colors">O Setup</a></li>
                            <li><a href="#recursos" onClick={(e) => scrollToSection(e, '#recursos')} className="hover:text-sky-400 transition-colors">Recursos</a></li>
                            <li><a href="#materias" onClick={(e) => scrollToSection(e, '#materias')} className="hover:text-sky-400 transition-colors">Matérias</a></li>
                            <li><a href="#depoimentos" onClick={(e) => scrollToSection(e, '#depoimentos')} className="hover:text-sky-400 transition-colors">Depoimentos</a></li>
                            <li><a href="#faq" onClick={(e) => scrollToSection(e, '#faq')} className="hover:text-sky-400 transition-colors">Dúvidas</a></li>
                            <li><a href="https://pay.kiwify.com.br/iIm4rTa" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">Garantir Acesso</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Precisa de Ajuda?</h4>
                        <p className="mb-4 text-sm">Fale com nosso suporte oficial via Telegram para dúvidas rápidas.</p>
                        <a
                            href="https://t.me/setupdoconcurseirobot"
                            target="_blank" rel="noopener noreferrer"
                            className="bg-sky-600/10 text-sky-400 border border-sky-500/20 px-6 py-3 rounded-xl font-bold hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center space-x-2"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>Suporte Exclusivo</span>
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-xs text-center">
                    <p>© {new Date().getFullYear()} Setup do Concurseiro. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

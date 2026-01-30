import React, { useState, useEffect } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingNavbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'O Setup', href: '#vantagens' },
        { name: 'Recursos', href: '#recursos' },
        { name: 'Conteúdo', href: '#materias' },
        { name: 'Cronogramas', href: '#cronogramas' },
        { name: 'Bônus', href: '#brindes' },
    ];

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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <a
                        href="#home"
                        onClick={(e) => scrollToSection(e, '#home')}
                        className="flex items-center space-x-2 cursor-pointer group"
                    >
                        <div className="bg-sky-600 p-2 rounded-xl group-hover:bg-sky-700 transition-colors">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                            Setup do <span className="text-sky-600 group-hover:text-sky-700">Concurseiro</span>
                        </span>
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="text-slate-600 hover:text-sky-600 font-semibold transition-colors text-xs uppercase tracking-wider"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="https://pay.kiwify.com.br/iIm4rTa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
                        >
                            GARANTIR ACESSO
                        </a>
                        <Link
                            to="/auth"
                            className="text-sky-600 hover:text-sky-700 font-bold transition-colors text-sm uppercase tracking-wider"
                        >
                            ACESSAR
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 absolute w-full shadow-xl">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => {
                                    scrollToSection(e, link.href);
                                    setIsMenuOpen(false);
                                }}
                                className="text-slate-600 hover:text-sky-600 font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="https://pay.kiwify.com.br/iIm4rTa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold text-center"
                        >
                            GARANTIR ACESSO
                        </a>
                        <Link
                            to="/auth"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-sky-600 hover:text-sky-700 font-bold text-center py-2 uppercase tracking-wider"
                        >
                            ACESSAR
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

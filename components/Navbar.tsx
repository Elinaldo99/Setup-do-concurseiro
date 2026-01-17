import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const isActive = (path: string) => location.pathname === path ? 'border-b-4 border-sky-600 text-sky-600' : 'text-slate-600 hover:text-sky-500';

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await signOut();
        navigate('/auth');
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="bg-sky-600 p-1.5 sm:p-2 rounded-lg group-hover:bg-sky-500 transition-colors">
                            <i className="fas fa-graduation-cap text-white text-lg sm:text-xl"></i>
                        </div>
                        <span className="font-bold text-base sm:text-xl text-slate-800 tracking-tight whitespace-nowrap">Setup do <span className="text-sky-600">Concurseiro</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 h-full items-center">
                        {user ? (
                            <>
                                <Link to="/materias" className={`px-1 pt-1 text-sm font-semibold transition-all h-full flex items-center ${isActive('/materias')}`}>Matérias</Link>
                                <Link to="/concursos" className={`px-1 pt-1 text-sm font-semibold transition-all h-full flex items-center ${isActive('/concursos')}`}>Concursos</Link>
                                <Link to="/simulados" className={`px-1 pt-1 text-sm font-semibold transition-all h-full flex items-center ${isActive('/simulados')}`}>Simulados</Link>
                                <Link to="/dicas" className={`px-1 pt-1 text-sm font-semibold transition-all h-full flex items-center ${isActive('/dicas')}`}>Dicas</Link>
                                <Link to="/cronograma" className={`px-1 pt-1 text-sm font-semibold transition-all h-full flex items-center ${isActive('/cronograma')}`}>Cronogramas</Link>
                                <Link to="/perfil" className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${location.pathname === '/perfil' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>
                                    <i className="fas fa-user-circle mr-2"></i>Meu Perfil
                                </Link>
                                <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 font-semibold text-sm">
                                    <i className="fas fa-sign-out-alt"></i> Sair
                                </button>
                            </>
                        ) : (
                            <Link to="/auth" className="bg-sky-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-sky-700 transition-all shadow-md">
                                Entrar
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-sky-600 p-2 focus:outline-none focus:bg-sky-50 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-16 left-0 w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out border-t border-sky-50 ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1 bg-white">
                    {user ? (
                        <>
                            <Link to="/materias" className={`block px-4 py-3 rounded-xl text-base font-semibold ${location.pathname === '/materias' ? 'bg-sky-50 text-sky-600' : 'text-slate-600'}`}>
                                <i className="fas fa-book-reader mr-3"></i>Matérias
                            </Link>
                            <Link to="/concursos" className={`block px-4 py-3 rounded-xl text-base font-semibold ${location.pathname === '/concursos' ? 'bg-sky-50 text-sky-600' : 'text-slate-600'}`}>
                                <i className="fas fa-file-signature mr-3"></i>Concursos
                            </Link>
                            <Link to="/simulados" className={`block px-4 py-3 rounded-xl text-base font-semibold ${location.pathname === '/simulados' ? 'bg-sky-50 text-sky-600' : 'text-slate-600'}`}>
                                <i className="fas fa-laptop-code mr-3"></i>Simulados
                            </Link>
                            <Link to="/dicas" className={`block px-4 py-3 rounded-xl text-base font-semibold ${location.pathname === '/dicas' ? 'bg-sky-50 text-sky-600' : 'text-slate-600'}`}>
                                <i className="fas fa-magic mr-3"></i>Dicas
                            </Link>
                            <Link to="/cronograma" className={`block px-4 py-3 rounded-xl text-base font-semibold ${location.pathname === '/cronograma' ? 'bg-sky-50 text-sky-600' : 'text-slate-600'}`}>
                                <i className="fas fa-calendar-alt mr-3"></i>Cronogramas
                            </Link>
                            <div className="pt-4 border-t border-slate-100 mt-2">
                                <Link to="/perfil" className={`block px-4 py-4 rounded-2xl text-base font-bold text-center ${location.pathname === '/perfil' ? 'bg-sky-600 text-white shadow-lg' : 'bg-sky-50 text-sky-600'}`}>
                                    <i className="fas fa-user-circle mr-3"></i>Meu Perfil
                                </Link>
                                <button onClick={handleLogout} className="w-full mt-2 block px-4 py-3 rounded-xl text-base font-bold text-center text-red-500 hover:bg-red-50">
                                    <i className="fas fa-sign-out-alt mr-3"></i>Sair
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-4 mt-2">
                            <Link to="/auth" className="block px-4 py-4 rounded-2xl text-base font-bold text-center bg-sky-600 text-white shadow-lg">
                                Entrar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

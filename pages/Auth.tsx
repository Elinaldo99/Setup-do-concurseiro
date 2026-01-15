import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Verifique seu email para confirmar o cadastro!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Ocorreu um erro.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 text-sky-600 mb-4 text-3xl">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800">
                            Setup do <span className="text-sky-600">Concurseiro</span>
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {isSignUp ? 'Crie sua conta para começar' : 'Bem-vindo de volta!'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none transition-all"
                                        placeholder="Seu nome completo"
                                    />
                                    <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none transition-all"
                                    placeholder="seu@email.com"
                                />
                                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-4 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg hover:shadow-sky-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <i className="fas fa-circle-notch animate-spin"></i>
                            ) : (
                                isSignUp ? 'Criar Conta' : 'Entrar'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-slate-500 hover:text-sky-600 text-sm font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <i className="fas fa-arrow-left"></i>
                            Voltar para a Página Inicial
                        </button>
                    </div>
                </div>
                <div className="bg-sky-50 p-4 text-center text-xs text-sky-700 font-bold">
                    <i className="fas fa-shield-alt mr-2"></i> Ambiente Seguro
                </div>
            </div>
        </div>
    );
};

export default Auth;

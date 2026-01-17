import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 text-4xl">
                        <i className="fas fa-check-circle"></i>
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                        Pagamento Confirmado!
                    </h2>

                    <p className="text-slate-500 mb-8">
                        Seu acesso ao Setup do Concurseiro já foi liberado.
                    </p>

                    <div className="bg-sky-50 rounded-2xl p-6 mb-8 text-left border border-sky-100">
                        <h3 className="text-sky-800 font-bold mb-4 flex items-center gap-2">
                            <i className="fas fa-info-circle"></i>
                            Dados de Acesso
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Login</p>
                                <p className="text-slate-700 font-medium bg-white p-3 rounded-lg border border-sky-100">
                                    Seu e-mail de cadastro
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">Senha Inicial</p>
                                <p className="text-slate-700 font-medium bg-white p-3 rounded-lg border border-sky-100">
                                    Seu CPF (somente números)
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/auth')}
                        className="w-full bg-sky-600 text-white py-4 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg hover:shadow-sky-200 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-sign-in-alt"></i>
                        Fazer Login
                    </button>

                    <div className="mt-6">
                        <p className="text-xs text-slate-400">
                            Em caso de dúvidas, entre em contato com o suporte.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading, hasAccess } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" />;
    }

    if (!hasAccess) {
        // Redireciona para uma página de "Comprar" ou exibe mensagem
        // Por enquanto vamos redirecionar para '/' ou uma rota específica de vendas
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-4">
                <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso Bloqueado</h2>
                    <p className="text-gray-600 mb-6">
                        Você precisa completar sua assinatura para acessar este conteúdo.
                    </p>
                    <a
                        href="https://pay.kiwify.com.br/crfqs1u"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Realizar Pagamento
                    </a>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="block mt-4 text-sky-600 hover:underline mx-auto"
                    >
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';
import LandingPage from '../pages/LandingPage';

const HomeRoute: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    return user ? <Home /> : <LandingPage />;
};

export default HomeRoute;

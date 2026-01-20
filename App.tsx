import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { recordActivity } from './lib/activityTracker';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Materias from './pages/Materias';
import Concursos from './pages/Concursos';
import Dicas from './pages/Dicas';
import Cronograma from './pages/Cronograma';
import Perfil from './pages/Perfil';
import Auth from './pages/Auth';
import ThankYou from './pages/ThankYou';
import Simulados from './pages/Simulados';
import ProtectedRoute from './components/ProtectedRoute';
import HomeRoute from './components/HomeRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      recordActivity('login');
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Navbar and Footer for authenticated users */}
      {user && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/materias" element={
            <ProtectedRoute>
              <Materias />
            </ProtectedRoute>
          } />
          <Route path="/concursos" element={
            <ProtectedRoute>
              <Concursos />
            </ProtectedRoute>
          } />
          <Route path="/simulados" element={
            <ProtectedRoute>
              <Simulados />
            </ProtectedRoute>
          } />
          <Route path="/dicas" element={
            <ProtectedRoute>
              <Dicas />
            </ProtectedRoute>
          } />
          <Route path="/cronograma" element={
            <ProtectedRoute>
              <Cronograma />
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />

          <Route path="/agradecimento" element={<ThankYou />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  );
};

export default App;

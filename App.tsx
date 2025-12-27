import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Materias from './pages/Materias';
import Concursos from './pages/Concursos';
import Dicas from './pages/Dicas';
import Cronograma from './pages/Cronograma';
import Perfil from './pages/Perfil';
import Auth from './pages/Auth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-circle-notch animate-spin text-sky-600 text-3xl"></i></div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

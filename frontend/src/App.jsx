import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PageList from './pages/PageList';
import PageDetail from './pages/PageDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddPage from './pages/AddPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/pages" element={<PageList />} />
                  <Route path="/pages/:id" element={<PageDetail />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/add" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AddPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Layout>
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

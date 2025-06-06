// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import useThemeStore from './store/useThemeStore';
import useAuthStore from './store/useAuthStore';
import useTaskStore from './store/useTaskStore';

const App: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchTasks } = useTaskStore();
  
  // Check system preference on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && theme === 'light') {
      setTheme('dark');
    }
  }, [theme, setTheme]);
  
  // Fetch tasks when user logs in
  useEffect(() => {
    if (user) {
      fetchTasks(user.id);
    }
  }, [user, fetchTasks]);
  
  // Log authentication state for debugging
  console.log('Authentication state:', { isAuthenticated, user });
  
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />
              <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;

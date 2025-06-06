// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/useAuthStore';
import { AuthFormData } from '../types';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  
  const handleLogin = async (data: AuthFormData) => {
    try {
      // Make API call to verify credentials
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: data.email,
        password: data.password
      });
      
      // If successful, update auth store with user data
      login({
        id: response.data.id || response.data._id,
        name: response.data.name,
        email: response.data.email,
        createdAt: new Date(response.data.createdAt),
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };
  
  const handleToggleForm = () => {
    navigate('/signup');
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome to StudyTrack</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md">
          Your personal academic task manager to stay organized and productive.
        </p>
      </motion.div>
      
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <AuthForm 
          type="login" 
          onSubmit={handleLogin} 
          onToggleForm={handleToggleForm} 
        />
      </div>
    </div>
  );
};

export default LoginPage;

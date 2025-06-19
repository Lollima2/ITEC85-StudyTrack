// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/useAuthStore';
import { AuthFormData } from '../types';
import axios from 'axios';
import heroIcon from '../components/icons/Hero_Logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');

  const handleLogin = async (
    formData: AuthFormData,
    setAuthError: (error: string) => void
  ) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      login({
        id: response.data.id || response.data._id,
        name: response.data.name,
        email: response.data.email,
        createdAt: new Date(response.data.createdAt),
      });

      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError(err.response?.data?.message || 'Invalid email or password.');
    }
  };

  const handleToggleForm = () => {
    navigate('/signup');
  };

  return (
    <div className="relative w-full min-h-screen bg-lightBg dark:bg-darkBg overflow-hidden pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Animated Circles */}
      <div className="absolute w-[32rem] h-[32rem] bg-circle1 rounded-full blur-3xl opacity-30 animate-moveCircle1 pointer-events-none"></div>
      <div className="absolute w-[32rem] h-[32rem] bg-circle2 rounded-full blur-2xl opacity-30 animate-moveCircle2 pointer-events-none"></div>

      {/* Glass container split in two */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 mx-auto">

        {/* Left: Welcome Message & Hero Icon */}
        <div className="flex flex-col items-center justify-center text-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex flex-col items-center"
          >
            <img
              src={heroIcon}
              alt="Hero Icon"
              className="w-56 h-56 mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome to IskoTasks!
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-sm">
              Stay on top of your academic tasks with ease. Let's make study time smarter!
            </p>
          </motion.div>
        </div>

        {/* Right: Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
              Log in to IskoTasks
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              Enter your credentials to access your dashboard.
            </p>
          </motion.div>

          <div className="w-full">
            <AuthForm
              type="login"
              onSubmit={handleLogin}
              onToggleForm={handleToggleForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/useAuthStore';
import { AuthFormData } from '../types';
import axios from 'axios';
import heroIcon from '../components/icons/Hero_Logo.png';
import useToast from '../store/useToast';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSignup = async (data: AuthFormData) => {
    if (data.name && data.email) {
      try {
        console.log('Sending signup request:', { name: data.name, email: data.email });

        const response = await axios.post('http://localhost:3000/auth/signup', data);
        console.log('Signup response:', response.data);

        signup({
          name: data.name,
          email: data.email,
        });

        showToast('Account created successfully!', 'center');
        setTimeout(() => navigate('/'), 2000);

      } catch (err: any) {
        console.error('Signup error:', err);
        setError(err.response?.data?.message || 'Failed to create account');
      }
    }
  };

  const handleToggleForm = () => {
    navigate('/login');
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
              className="w-56 h-56 mb-6 mx-auto"
            />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to StudyTrack!</h2>
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
              Join StudyTrack Today
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              Create your account and start organizing your academic life efficiently.
            </p>
          </motion.div>

          <div className="w-full">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <AuthForm
              type="signup"
              onSubmit={handleSignup}
              onToggleForm={handleToggleForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/useAuthStore';
import { AuthFormData } from '../types';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [error, setError] = useState('');
  
  const handleSignup = async (data: AuthFormData) => {
    if (data.name && data.email) {
      try {
        console.log('Sending signup request:', { name: data.name, email: data.email });
        
        // Make API call to create user in MongoDB
        const response = await axios.post('http://localhost:3000/auth/signup', data);
        console.log('Signup response:', response.data);
        
        // Update local state with the new user
        signup({
          name: data.name,
          email: data.email,
        });
        
        navigate('/');
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Join StudyTrack Today</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md">
          Create your account and start organizing your academic life efficiently.
        </p>
      </motion.div>
      
      <div className="w-full max-w-md">
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
  );
};

export default SignupPage;

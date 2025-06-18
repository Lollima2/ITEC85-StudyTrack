import React, { useState } from 'react';
import { User, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthFormData } from '../../types';
import { Button } from "@heroui/react";
import Input from '../ui/Input';
import Card from '../ui/Card';


interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: AuthFormData, setAuthError: (error: string) => void) => void;
  onToggleForm: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, onToggleForm }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear auth error if user changes input
    if (authError) setAuthError('');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (type === 'signup' && !formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setAuthError('');
      onSubmit(formData, setAuthError); // <- pass the setter
    }
  };

  return (
    <Card className="w-full max-w-md px-4 sm:px-8 md:px-12 lg:px-20 mx-auto flex flex-col justify-center items-center bg-white dark:bg-gray-900 shadow-lg">
      <motion.div
        key={type}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>


        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <Input
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={errors.name}
              icon={<User size={18} className="text-gray-400" />}
            />
          )}

          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={errors.email}
            icon={<Mail size={18} className="text-gray-400" />}
          />

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              error={errors.password}
              icon={<Lock size={18} className="text-gray-400" />}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

            {authError && (
              <div className="flex items-center gap-2 mt-3 px-4 py-1 rounded-full border border-red-300 dark:border-red-700 bg-red-50/60 dark:bg-red-900/40 text-red-700 dark:text-red-200 text-sm font-medium backdrop-blur-md animate-shake transition-all duration-300">
              <svg
                className="w-4 h-4 text-red-600 dark:text-red-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              </div>
            )}
            

          <Button
            type="submit"
            fullWidth
            className="bg-gradient-to-tr from-circle1 to-circle2 text-white shadow-lg mt-6 font-medium"
            radius="full"
          >
            {type === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {type === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={onToggleForm}
              className="ml-1 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              {type === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>


    </Card>
  );
};

export default AuthForm;

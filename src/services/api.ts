import axios from 'axios';
import { AuthFormData, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authApi = {
  signup: async (data: AuthFormData): Promise<User> => {
    try {
      console.log('Sending signup request with data:', data);
      const response = await api.post('/auth/signup', data);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  
  login: async (data: AuthFormData): Promise<User> => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

export default api;
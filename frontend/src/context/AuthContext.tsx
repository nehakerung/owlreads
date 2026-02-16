'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:8000/api/auth',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get('refresh_token');
          const response = await axios.post(
            'http://localhost:8000/api/auth/token/refresh/',
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          Cookies.set('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          const response = await api.get('/user/');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user', error);
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/login/', { username, password });
    const { access, refresh } = response.data;

    Cookies.set('access_token', access);
    Cookies.set('refresh_token', refresh);

    const userResponse = await api.get('/user/');
    setUser(userResponse.data);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => {
    await api.post('/register/', { username, email, password, password2 });
    await login(username, password);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

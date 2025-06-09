// providers/Auth.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    user: any;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    logout: async () => { },
    register: async () => { },
    loading: true,
});

const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/students/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            const response = await fetch('/api/students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/students/logout', {
                method: 'POST',
            });
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const register = async (userData: any) => {
        try {
            // Generate a password and add it to the user data
            const password = generatePassword();
            const userDataWithPassword = { ...userData, password };

            // Register the user
            const response = await fetch('/api/students/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDataWithPassword),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Registration failed');
            }

            const data = await response.json();

            // Add the generated password to the returned data
            const userWithPassword = { ...data.user, password };
            setUser(userWithPassword);
            localStorage.setItem('user', JSON.stringify(userWithPassword));
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // Send welcome email after successful registration
            await fetch('/api/sendWelcomeEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone,
                    college: userData.college,
                    dept: userData.dept,
                    username: userData.email,
                    password: password,
                }),
            });

            return userWithPassword;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
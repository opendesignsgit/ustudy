"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    user: any;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<void>;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateUser: (userData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    logout: async () => { },
    register: async () => { },
    loading: true,
    refreshUser: async () => { },
    updateUser: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await fetch('/api/students/me?depth=1', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => { await fetchUser(); };

    useEffect(() => {
        fetchUser();

        const handleStorageChange = () => fetchUser();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authchange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authchange', handleStorageChange);
        };
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            setLoading(true);
            const response = await fetch('/api/students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            localStorage.setItem('token', data.token);
            await fetchUser();
            window.dispatchEvent(new Event("authchange"));
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await fetch('/api/students/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event("authchange"));
        router.push('/login');
    };

    const register = async (userData: any) => {
        setLoading(true);
        try {
            const password = Math.random().toString(36).slice(-8);
            const userDataWithPassword = { ...userData, password };
            const response = await fetch('/api/students/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDataWithPassword),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Registration failed');
            }
            await fetchUser();
            window.dispatchEvent(new Event("authchange"));
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userData: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Not authenticated");
            const response = await fetch('/api/students/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update profile');
            }
            await fetchUser();
            window.dispatchEvent(new Event("authchange"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, refreshUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
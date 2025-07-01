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
                setLoading(false);
                return;
            }
            const response = await fetch('/api/students/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
                if (data && data.id) {
                    // Fetch bookings count
                    const bookingsRes = await fetch(`/api/bookings?where[student][equals]=${data.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    let bookingsCount = 0;
                    if (bookingsRes.ok) {
                        const bookingsData = await bookingsRes.json();
                        bookingsCount = bookingsData.totalDocs || bookingsData.total || bookingsData.docs?.length || 0;
                    }
                    const userWithCount = { ...data, bookingsCount };
                    setUser(userWithCount);
                    localStorage.setItem('user', JSON.stringify(userWithCount));
                } else {
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    useEffect(() => {
        fetchUser();

        const handleStorageChange = () => {
            fetchUser();
        };

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

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            window.dispatchEvent(new Event("authchange"));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/students/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            window.dispatchEvent(new Event("authchange"));
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const register = async (userData: any) => {
        try {
            setLoading(true);
            const password = Math.random().toString(36).slice(-8);
            const userDataWithPassword = { ...userData, password };

            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDataWithPassword),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Registration failed');
            }

            const data = await response.json();
            const userWithPassword = { ...data.user, password };

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userWithPassword));
            setUser(userWithPassword);
            window.dispatchEvent(new Event("authchange"));

            // Send welcome email
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
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userData: any) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Not authenticated");

            // If using /api/students/:id:
            const response = await fetch(`/api/students/${userData.id}`, {
                method: 'PATCH',
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

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            window.dispatchEvent(new Event("authchange"));
            return data;
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
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
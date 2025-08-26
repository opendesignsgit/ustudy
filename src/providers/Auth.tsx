//src\providers\Auth.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    user: any;
    universityUser: any;
    userType: 'student' | 'university' | null;
    login: (credentials: { email: string; password: string }, type?: 'student' | 'university') => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: any, type?: 'student' | 'university') => Promise<void>;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateUser: (userData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    universityUser: null,
    userType: null,
    login: async () => { },
    logout: async () => { },
    register: async () => { },
    loading: true,
    refreshUser: async () => { },
    updateUser: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [universityUser, setUniversityUser] = useState<any>(null);
    const [userType, setUserType] = useState<'student' | 'university' | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUserType = localStorage.getItem('userType') as 'student' | 'university' | null;
            
            if (!token || !storedUserType) {
                setLoading(false);
                return;
            }

            const endpoint = storedUserType === 'student' ? '/api/students/me' : '/api/users/me';
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                
                if (storedUserType === 'student') {
                    setUser(data);
                    setUniversityUser(null);
                    localStorage.setItem('user', JSON.stringify(data));
                    
                    if (data && data.id) {
                        // Fetch bookings count for students
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
                    }
                } else {
                    // For universities, we get a User object with university-role
                    // We need to fetch the actual university data and store both
                    const userRecord = data.user || data;
                    setUser(userRecord);
                    localStorage.setItem('user', JSON.stringify(userRecord));
                    
                    // Fetch the corresponding university data if we have the relationship
                    if (userRecord.university) {
                        try {
                            const universityRes = await fetch(`/api/universities/${userRecord.university}`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            if (universityRes.ok) {
                                const universityData = await universityRes.json();
                                setUniversityUser(universityData);
                                localStorage.setItem('universityUser', JSON.stringify(universityData));
                            }
                        } catch (error) {
                            console.error("Error fetching university data:", error);
                        }
                    }
                }
                
                setUserType(storedUserType);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('universityUser');
                localStorage.removeItem('userType');
                setUser(null);
                setUniversityUser(null);
                setUserType(null);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('universityUser');
            localStorage.removeItem('userType');
            setUser(null);
            setUniversityUser(null);
            setUserType(null);
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

    const login = async (credentials: { email: string; password: string }, type: 'student' | 'university' = 'student') => {
        try {
            setLoading(true);
            const endpoint = type === 'student' ? '/api/students/login' : '/api/users/login';
            
            // For university login, we need to authenticate through the Users collection
            if (type === 'university') {
                // First, check if there's a university-role user for this email
                const userCheckRes = await fetch(`/api/users?where[email][equals]=${credentials.email}&where[role][equals]=university-role`);
                const userCheckData = await userCheckRes.json();
                
                if (!userCheckData.docs || userCheckData.docs.length === 0) {
                    throw new Error('No university account found with this email. Please contact support.');
                }
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userType', type);
            
            if (type === 'student') {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setUniversityUser(null);
            } else {
                // For universities, we now get a User object with university-role
                // We need to fetch the actual university data and store both
                const userRecord = data.user;
                localStorage.setItem('user', JSON.stringify(userRecord)); // Store the user record for admin panel
                setUser(userRecord);
                
                // Fetch the corresponding university data
                if (userRecord.university) {
                    try {
                        const universityRes = await fetch(`/api/universities/${userRecord.university}`, {
                            headers: {
                                'Authorization': `Bearer ${data.token}`,
                            },
                        });
                        if (universityRes.ok) {
                            const universityData = await universityRes.json();
                            localStorage.setItem('universityUser', JSON.stringify(universityData));
                            setUniversityUser(universityData);
                        }
                    } catch (error) {
                        console.error("Error fetching university data:", error);
                    }
                }
            }
            
            setUserType(type);
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
            const endpoint = userType === 'student' ? '/api/students/logout' : '/api/users/logout';
            await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('universityUser');
            localStorage.removeItem('userType');
            setUser(null);
            setUniversityUser(null);
            setUserType(null);
            window.dispatchEvent(new Event("authchange"));
            router.push(userType === 'student' ? '/login' : '/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const register = async (userData: any, type: 'student' | 'university' = 'student') => {
        try {
            setLoading(true);
            const password = Math.random().toString(36).slice(-8);
            const userDataWithPassword = { ...userData, password };

            const endpoint = type === 'student' ? '/api/students' : '/api/universities';
            const response = await fetch(endpoint, {
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
            localStorage.setItem('userType', type);
            
            if (type === 'student') {
                localStorage.setItem('user', JSON.stringify(userWithPassword));
                setUser(userWithPassword);
                setUniversityUser(null);
            } else {
                localStorage.setItem('universityUser', JSON.stringify(userWithPassword));
                setUniversityUser(userWithPassword);
                setUser(null);
            }
            
            setUserType(type);
            window.dispatchEvent(new Event("authchange"));

            // Send welcome email
            const emailEndpoint = type === 'student' ? '/api/sendWelcomeEmail' : '/api/sendUniversityWelcomeEmail';
            const emailData = type === 'student' 
                ? {
                    email: userData.email,
                    name: userData.name,
                    phone: userData.phone,
                    college: userData.college,
                    dept: userData.dept,
                    username: userData.email,
                    password: password,
                  }
                : {
                    email: userData.email,
                    title: userData.title,
                    phone: userData.phone,
                    username: userData.email,
                    password: password,
                  };

            await fetch(emailEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData),
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

            const endpoint = userType === 'student' ? `/api/students/${userData.id}` : `/api/universities/${userData.id}`;
            const response = await fetch(endpoint, {
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
            
            if (userType === 'student') {
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
            } else {
                localStorage.setItem('universityUser', JSON.stringify(data));
                setUniversityUser(data);
            }
            
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
        <AuthContext.Provider value={{ user, universityUser, userType, login, logout, register, loading, refreshUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
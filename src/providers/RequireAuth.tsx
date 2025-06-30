"use client";
import { useAuth } from './Auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="text-center pt-24 text-lg text-primary">Loading...</div>;
    }

    return <>{children}</>;
};
// RegisterFlow.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FloatingEnrollButton } from './FloatingEnrollButton';
import { RegisterFormModal } from './RegisterFormModal';
import { useAuth } from '@/providers/Auth';

export const RegisterFlow = ({ pageId }: { pageId?: number }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { user } = useAuth();

    return (
        <>
            <FloatingEnrollButton onClick={() => setIsFormOpen(true)} />

            <RegisterFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                pageId={pageId}
                user={user}
            />
        </>
    );
};
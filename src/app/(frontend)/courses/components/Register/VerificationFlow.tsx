"use client";

import React, { useState } from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { PhoneVerification } from './PhoneVerification';
import { EmailVerification } from './EmailVerification';
import { useAuth } from '@/providers/Auth';

type VerificationFlowProps = {
    onSuccess: (data: any) => void;
    onClose: () => void;
    onToggleToLogin: () => void;
    onLoginSuccess?: (loginData: any) => void; // <-- Added for login support
};

export const VerificationFlow = ({
    onSuccess,
    onClose,
    onToggleToLogin,
    onLoginSuccess
}: VerificationFlowProps) => {
    const [step, setStep] = useState<'personal' | 'phone' | 'email'>('personal');
    const [formData, setFormData] = useState<any>({});
    const { register } = useAuth();

    // Called after registration form submit (could be register or login)
    const handlePersonalInfoSubmit = (data: any) => {
        // If login was successful, data will likely have a user or token
        if (data && data.token && onLoginSuccess) {
            onLoginSuccess(data); // Skip verification, go to payment in modal
        } else {
            setFormData(data);
            setStep('phone');
        }
    };

    const handlePhoneVerified = () => {
        setStep('email');
    };

    const handleEmailVerified = async () => {
        try {
            // Register the user with all collected data
            const user = await register({
                ...formData,
                isPhoneVerified: true,
                isEmailVerified: true
            });

            onSuccess(user);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="space-y-4">
            {step === 'personal' && (
                <PersonalInfoForm
                    onSubmit={handlePersonalInfoSubmit}
                    onClose={onClose}
                />
            )}

            {step === 'phone' && (
                <PhoneVerification
                    phone={formData.phone}
                    onVerified={handlePhoneVerified}
                    onBack={() => setStep('personal')}
                />
            )}

            {step === 'email' && (
                <EmailVerification
                    email={formData.email}
                    onVerified={handleEmailVerified}
                    onBack={() => setStep('phone')}
                />
            )}
        </div>
    );
};
// VerificationFlow.tsx
"use client";

import React, { useState } from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { PhoneVerification } from './PhoneVerification';
import { EmailVerification } from './EmailVerification';
import { useAuth } from '@/providers/Auth';


type VerificationFlowProps = {
    onSuccess: (data: any) => void;
    onClose: () => void;
};
export const VerificationFlow = ({ onSuccess, onClose }: VerificationFlowProps) => {
    const [step, setStep] = useState<'personal' | 'phone' | 'email'>('personal');
    const [formData, setFormData] = useState<any>({});
    const { register } = useAuth();

    const handlePersonalInfoSubmit = (data: any) => {
        setFormData(data);
        setStep('phone');
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
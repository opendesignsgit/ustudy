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
    onLoginSuccess?: (loginData: any) => void;
};

export const VerificationFlow = ({
    onSuccess,
    onClose,
    onToggleToLogin,
    onLoginSuccess
}: VerificationFlowProps) => {
    const [step, setStep] = useState<'personal' | 'phone' | 'email'>('personal');
    const [formData, setFormData] = useState<any>({
        name: '',
        phone: '',
        email: '',
        college: '',
        dept: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const { register } = useAuth();

    const handlePersonalInfoSubmit = async (data: any) => {
        if (data && data.token && onLoginSuccess) {
            onLoginSuccess(data);
        } else {
            setFormData(data);
            setOtpSent(true);
            setStep('phone');
        }
    };

    const handleFieldChange = async (field: 'phone' | 'email', value: string) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        try {
            await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });
        } catch (error) {
            console.error(`Error sending ${field} OTP:`, error);
        }
    };

    const handlePhoneVerified = () => {
        setStep('email');
    };

    const handleEmailVerified = async () => {
        try {
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

    const handleBackFromPhone = () => {
        setStep('personal');
    };

    const handleBackFromEmail = () => {
        setStep('phone');
    };

    return (
        <div className="space-y-4">
            {step === 'personal' && (
                <PersonalInfoForm
                    initialData={formData}
                    onSubmit={handlePersonalInfoSubmit}
                    onClose={onClose}
                    shouldSendOtp={!otpSent} // Only send OTPs if not already sent
                />
            )}

            {step === 'phone' && (
                <PhoneVerification
                    phone={formData.phone}
                    onVerified={handlePhoneVerified}
                    onBack={handleBackFromPhone}
                    otpAlreadySent={otpSent}
                />
            )}

            {step === 'email' && (
                <EmailVerification
                    email={formData.email}
                    onVerified={handleEmailVerified}
                    onBack={handleBackFromEmail}
                    otpAlreadySent={otpSent}
                />
            )}
        </div>
    );
};
"use client";

import React, { useState } from 'react';
import { Modal } from './Modal';
import { VerificationFlow } from './VerificationFlow';
import { PaymentFlow } from './PaymentFlow';
import { CoursePriceDisplay } from './CoursePriceDisplay';

type RegisterFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    pageId?: number;
    user?: any;
    onToggleToLogin: () => void;
    onPaymentComplete?: () => void;
};

export const RegisterFormModal = ({
    isOpen,
    onClose,
    pageId,
    user,
    onToggleToLogin,
    onPaymentComplete,
}: RegisterFormModalProps) => {
    const [currentStep, setCurrentStep] = useState<'register' | 'payment'>('register');
    const [userData, setUserData] = useState<any>(null);

    // Called after registration & verification success
    const handleRegistrationSuccess = (data: any) => {
        setUserData(data);
        setCurrentStep('payment');
    };

    // Called after payment
    const handlePaymentComplete = () => {
        onClose();
        if (onPaymentComplete) {
            onPaymentComplete();
        }
    };

    // Called when login is successful from VerificationFlow's login
    const handleLoginSuccess = (loginData: any) => {
        setUserData(loginData?.user || loginData);
        setCurrentStep('payment');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Course Registration">
            {user || (currentStep === 'payment' && userData) ? (
                // User is logged in or just logged in - show payment directly
                <div className="space-y-4">
                    <PaymentFlow
                        userData={user || userData}
                        pageId={pageId}
                        onComplete={handlePaymentComplete}
                    />
                </div>
            ) : (
                // User not logged in - show verification flow
                <VerificationFlow
                    onSuccess={handleRegistrationSuccess}
                    onLoginSuccess={handleLoginSuccess}
                    onClose={onClose}
                    onToggleToLogin={onToggleToLogin}
                />
            )}
        </Modal>
    );
};
// RegisterFormModal.tsx
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
};

export const RegisterFormModal = ({
    isOpen,
    onClose,
    pageId,
    user,
}: RegisterFormModalProps) => {
    const [currentStep, setCurrentStep] = useState<'register' | 'payment'>('register');
    const [userData, setUserData] = useState<any>(null);

    const handleRegistrationSuccess = (data: any) => {
        setUserData(data);
        setCurrentStep('payment');
    };

    const handlePaymentComplete = () => {
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Course Registration">
            {user ? (
                // User is logged in - show payment directly
                <div className="space-y-4">
                    <CoursePriceDisplay pageId={pageId} />
                    <PaymentFlow
                        userData={user}
                        pageId={pageId}
                        onComplete={handlePaymentComplete}
                    />
                </div>
            ) : currentStep === 'register' ? (
                // User not logged in - show verification flow
                <VerificationFlow
                    onSuccess={handleRegistrationSuccess}
                    onClose={onClose}
                />
            ) : (
                // After verification - show payment
                <PaymentFlow
                    userData={userData}
                    pageId={pageId}
                    onComplete={handlePaymentComplete}
                />
            )}
        </Modal>
    );
};
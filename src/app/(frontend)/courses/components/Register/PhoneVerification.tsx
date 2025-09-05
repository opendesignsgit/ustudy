"use client";

import React, { useState, useEffect, useRef } from 'react';

type PhoneVerificationProps = {
    phone: string;
    onVerified: () => void;
    onBack: () => void;
    otpAlreadySent: boolean;  // Add this prop
};

export const PhoneVerification = ({
    phone,
    onVerified,
    onBack,
    otpAlreadySent  // Add this prop
}: PhoneVerificationProps) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [error, setError] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (otpAlreadySent) {
            setTimer(120);
            setShowOtpField(true);
        }
    }, [otpAlreadySent]);

    // Start timer on component mount only if OTP already sent
    useEffect(() => {
        if (otpAlreadySent) {
            setTimer(120);
            setShowOtpField(true);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Handle timer countdown
    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timer]);

    const handleResendOtp = async () => {
        try {
            setError('');
            setIsSendingOtp(true);
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend OTP');
            }

            setTimer(120);
            setShowOtpField(true);
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSendInitialOtp = async () => {
        try {
            setError('');
            setIsSendingOtp(true);
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            setTimer(120);
            setShowOtpField(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerify = async () => {
        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            const response = await fetch('/api/check-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    medium: 'phone',
                    phone,
                    otp,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid OTP');
            }

            onVerified(); // This moves to email verification
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Verify Your Phone</h3>
            <p className="text-sm text-gray-600">
                Phone number: <span className="font-medium">{phone}</span>
            </p>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {!showOtpField ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Click the button below to receive a verification code on your phone.
                    </p>
                    <button
                        type="button"
                        onClick={handleSendInitialOtp}
                        disabled={isSendingOtp}
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSendingOtp ? 'Sending OTP...' : 'Send Verification Code'}
                    </button>
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        We've sent a 6-digit verification code to <span className="font-medium">{phone}</span>
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 6) setOtp(value);
                            }}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={timer > 0 || isSendingOtp}
                            className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
                        >
                            {isSendingOtp ? 'Sending...' : timer > 0 ? `Resend in ${formatTime(timer)}` : 'Resend Code'}
                        </button>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={isVerifying || otp.length !== 6}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Phone'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
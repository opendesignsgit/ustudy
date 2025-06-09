"use client";

import React, { useState, useEffect, useRef } from 'react';

type EmailVerificationProps = {
    email: string;
    onVerified: () => void;
    onBack: () => void;
};

export const EmailVerification = ({ email, onVerified, onBack }: EmailVerificationProps) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Start timer on component mount
    useEffect(() => {
        setTimer(120); // 2 minutes timer

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
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
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
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend OTP');
            }

            setTimer(120); // Reset timer
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP');
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
                    medium: 'email',
                    email,
                    otp,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid OTP');
            }

            onVerified();
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
            <h3 className="text-lg font-medium">Verify Your Email</h3>
            <p className="text-sm text-gray-600">
                We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
            </p>

            {error && <div className="text-red-500 text-sm">{error}</div>}

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
                    disabled={timer > 0}
                    className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
                >
                    {timer > 0 ? `Resend in ${formatTime(timer)}` : 'Resend Code'}
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
                    {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>
            </div>
        </div>
    );
};
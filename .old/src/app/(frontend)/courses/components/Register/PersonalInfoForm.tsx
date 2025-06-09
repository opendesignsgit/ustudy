"use client";

import React, { useState } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

type PersonalInfoFormProps = {
    onSubmit: (data: any) => void;
    onClose: () => void;
};

export const PersonalInfoForm = ({ onSubmit, onClose }: PersonalInfoFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        college: '',
        dept: '',
    });
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (isValid: boolean, value: string, countryData: any) => {
        let cleanedValue = value;
        if (countryData.iso2 === 'in') {
            cleanedValue = value.replace(/\D/g, '');
            if (cleanedValue.length > 0 && !/^[6-9]/.test(cleanedValue)) {
                cleanedValue = cleanedValue.substring(1);
            }
            if (cleanedValue.length > 10) {
                cleanedValue = cleanedValue.substring(0, 10);
            }
        }
        setFormData(prev => ({ ...prev, phone: cleanedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setError('');

        try {
            // Send OTP to phone
            if (formData.phone) {
                const phoneResponse = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: formData.phone }),
                });
                if (!phoneResponse.ok) throw new Error('Failed to send phone OTP');
            }

            // Send OTP to email
            if (formData.email) {
                const emailResponse = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email }),
                });
                if (!emailResponse.ok) throw new Error('Failed to send email OTP');
            }

            onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to send verification codes');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <IntlTelInput
                        containerClassName="intl-tel-input"
                        inputClassName="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        fieldName="phone"
                        value={formData.phone}
                        onPhoneNumberChange={handlePhoneChange}
                        preferredCountries={['in']}
                        autoHideDialCode={true}
                        separateDialCode={true}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">College</label>
                    <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                        type="text"
                        name="dept"
                        value={formData.dept}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSending}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSending ? 'Sending OTPs...' : 'Continue'}
                    </button>
                </div>
            </div>
        </form>
    );
};
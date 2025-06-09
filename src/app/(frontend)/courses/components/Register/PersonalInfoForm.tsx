"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    const [phoneError, setPhoneError] = useState('');
    const [studentExists, setStudentExists] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);

    const router = useRouter();

    // Phone validation and formatting
    const formatPhone = (value: string) => {
        let cleaned = value.replace(/[^0-9]/g, '');
        if (cleaned.length > 0 && !/^[6-9]/.test(cleaned)) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.length > 10) {
            cleaned = cleaned.substring(0, 10);
        }
        return cleaned;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatPhone(rawValue);
        setFormData(prev => ({ ...prev, phone: formatted }));

        if (formatted.length !== 10) {
            setPhoneError('Phone number must be 10 digits starting with 6-9');
        } else {
            setPhoneError('');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Check if student exists (by phone or email)
    const checkStudentExists = async (phone: string, email: string) => {
        if (!phone && !email) return false;
        try {
            let url = '/api/students?';
            if (phone && email) {
                // OR filter for both phone or email
                url += `where[or][0][phone][equals]=${encodeURIComponent(phone)}&where[or][1][email][equals]=${encodeURIComponent(email)}`;
            } else if (phone) {
                url += `where[phone][equals]=${encodeURIComponent(phone)}`;
            } else if (email) {
                url += `where[email][equals]=${encodeURIComponent(email)}`;
            }
            const res = await fetch(url, { method: 'GET' });
            const data = await res.json();
            return data.docs && data.docs.length > 0;
        } catch {
            return false;
        }
    };

    // Handle form submit (OTP flow, and check student exists here only)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setError('');

        // Do the checkStudentExists during submit
        const exists = await checkStudentExists(formData.phone, formData.email);
        setStudentExists(exists);

        if (exists) {
            setError('User already exists. Please login.');
            setIsSending(false);
            setShowLoginForm(true);
            return;
        } else {
            try {
                if (formData.phone) {
                    const phoneResponse = await fetch('/api/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: formData.phone }),
                    });
                    if (!phoneResponse.ok) throw new Error('Failed to send phone OTP');
                }

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
        }
    };

    // Minimal LoginForm (embedded for simplicity)
    const LoginForm = ({
        phone,
        email,
        onSuccess,
        onClose,
    }: {
        phone?: string;
        email?: string;
        onSuccess: (user: any) => void;
        onClose: () => void;
    }) => {
        const [form, setForm] = useState({
            phone: phone || '',
            email: email || '',
            password: '',
        });
        const [loginError, setLoginError] = useState('');
        const [successMessage, setSuccessMessage] = useState('');

        const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setForm(f => ({ ...f, [name]: value }));
        };

        const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoginError('');
            setSuccessMessage('');

            let loginEmail = form.email; // This field might be an email OR a phone

            // If the input is a phone (all digits, length 10), look up the email
            if (/^[0-9]{10}$/.test(loginEmail)) {
                // Lookup student by phone
                const res = await fetch(`/api/students?where[phone][equals]=${loginEmail}`);
                const data = await res.json();
                if (!data.docs || !data.docs[0]) {
                    setLoginError("No user with this phone number");
                    return;
                }
                loginEmail = data.docs[0].email;
            }

            // Now login using the (possibly looked-up) email
            try {
                const res = await fetch("/api/students/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: loginEmail,
                        password: form.password,
                    }),
                });

                if (res.ok) {
                    const json = await res.json();
                    setSuccessMessage("Login successful");
                    localStorage.setItem("token", json.token);
                    localStorage.setItem("user", JSON.stringify(json.user));
                    onSuccess(json);
                } else {
                    const errorData = await res.json();
                    setLoginError(errorData.message || "Invalid credentials");
                }
            } catch (error: any) {
                setLoginError("Error: " + error.message);
            }
        };

        return (
            <form onSubmit={handleLogin} className="space-y-2 mt-4">
                {loginError && <div className="text-red-500">{loginError}</div>}
                {successMessage && <div className="text-green-600">{successMessage}</div>}
                <input
                    name="email"
                    type="text"
                    value={form.email}
                    onChange={handleLoginChange}
                    placeholder="Email / Phone Number"
                    required
                    className="block w-full border border-gray-300 rounded-md py-2 px-3"
                />
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleLoginChange}
                    placeholder="Password"
                    required
                    className="block w-full border border-gray-300 rounded-md py-2 px-3"
                />
                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">
                        Login
                    </button>
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
                        Cancel
                    </button>
                </div>
            </form>
        );
    };

    if (showLoginForm) {
        return (
            <div>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <LoginForm
                    phone={formData.phone}
                    email={formData.email}
                    onSuccess={onSubmit}
                    onClose={() => {
                        setShowLoginForm(false);
                        setError('');
                    }}
                />
            </div>
        );
    }

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
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                        required
                    />
                    {phoneError && <div className="text-red-500 text-xs mt-1">{phoneError}</div>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
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
                        disabled={isSending || phoneError !== ''}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSending ? 'Sending OTPs...' : 'Continue'}
                    </button>
                </div>
            </div>
            {/* Add "Already a user? Login" button below form */}
            <div className="pt-4 text-center">
                <span className="text-sm text-gray-600 mr-2">Already a user?</span>
                <button
                    type="button"
                    className="text-indigo-600 hover:underline text-sm font-medium"
                    onClick={() => setShowLoginForm(true)}
                >
                    Login
                </button>
            </div>
        </form>
    );
};
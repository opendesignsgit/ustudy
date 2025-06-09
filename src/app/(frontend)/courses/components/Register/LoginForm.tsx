import React, { useState } from 'react';
export const LoginForm = ({ onSuccess, onClose }) => {
    const [form, setForm] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error('Login failed');
            const data = await res.json();
            onSuccess(data);
        } catch (err) {
            setError('Invalid credentialss1');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <div className="text-red-500">{error}</div>}
            <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
            />
            <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};
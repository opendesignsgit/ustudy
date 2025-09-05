// UniversityRegisterForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { LoginForm } from "./LoginForm";

const THEME_COLOR = "#34c3ec";

export const UniversityRegisterForm = ({ onToggle }: { onToggle: () => void }) => {
    const [formData, setFormData] = useState({
        title: "",
        email: "",
        phone: "",
        country: "",
        template: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await register(formData);
            setSuccess("Registration successful! Redirecting to dashboard...");
            router.push("/university-dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <h2 className="text-lg font-bold mb-8 text-[#34c3ec]">University Registration</h2>

            {/* University Name */}
            <div className="mb-4">
                <label className="block mb-1">University Name</label>
                <input
                    type="text"
                    className="w-full border rounded p-2 text-black"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                    type="email"
                    className="w-full border rounded p-2 text-black"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>

            {/* Phone */}
            <div className="mb-4">
                <label className="block mb-1">Phone</label>
                <input
                    type="tel"
                    className="w-full border rounded p-2 text-black"
                    value={formData.phone}
                    onChange={(e) => setFormData({
                        ...formData,
                        phone: e.target.value.replace(/[^0-9]/g, "")
                    })}
                    maxLength={15}
                    required
                />
            </div>

            {/* Country */}
            <div className="mb-4">
                <label className="block mb-1">Country</label>
                <input
                    type="text"
                    className="w-full border rounded p-2 text-black"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                />
            </div>

            {/* Template */}
            <div className="mb-4">
                <label className="block mb-1">Template</label>
                <select
                    className="w-full border rounded p-2 text-black"
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    required
                >
                    <option value="">Select a template</option>
                    {/* You would fetch these options from your API */}
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                </select>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}

            <button
                type="submit"
                className="w-full bg-[#34c3ec] hover:bg-[#34b2d7] text-white p-2 rounded"
                disabled={loading}
            >
                {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-4 text-center">
                Already have an account?{" "}
                <button type="button" className="text-[#34c3ec] underline" onClick={onToggle}>
                    Login
                </button>
            </p>
        </form>
    );
};
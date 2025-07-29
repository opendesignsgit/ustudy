//src\app\(frontend)\components\RegisterForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";

const THEME_COLOR = "#34c3ec";
const OTP_TIMER = 120;

export const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        college: "",
        dept: "",
        terms: false,
    });
    const [fieldVer, setFieldVer] = useState<{ phone: boolean; email: boolean }>({ phone: false, email: false });
    const [stage, setStage] = useState<"fields" | "phone-otp" | "email-otp">("fields");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [emailOtp, setEmailOtp] = useState("");
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
    const [emailOtpTimer, setEmailOtpTimer] = useState(0);
    const phoneOtpInterval = useRef<NodeJS.Timeout | null>(null);
    const emailOtpInterval = useRef<NodeJS.Timeout | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showLoginInstead, setShowLoginInstead] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (phoneOtpSent && phoneOtpTimer === 0) setPhoneOtpSent(false);
        if (phoneOtpSent && phoneOtpTimer > 0 && !phoneOtpInterval.current) {
            phoneOtpInterval.current = setInterval(() => {
                setPhoneOtpTimer((prev) => {
                    if (prev <= 1) {
                        if (phoneOtpInterval.current) clearInterval(phoneOtpInterval.current);
                        phoneOtpInterval.current = null;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (phoneOtpInterval.current) {
                clearInterval(phoneOtpInterval.current);
                phoneOtpInterval.current = null;
            }
        };
    }, [phoneOtpSent, phoneOtpTimer]);

    useEffect(() => {
        if (emailOtpSent && emailOtpTimer === 0) setEmailOtpSent(false);
        if (emailOtpSent && emailOtpTimer > 0 && !emailOtpInterval.current) {
            emailOtpInterval.current = setInterval(() => {
                setEmailOtpTimer((prev) => {
                    if (prev <= 1) {
                        if (emailOtpInterval.current) clearInterval(emailOtpInterval.current);
                        emailOtpInterval.current = null;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (emailOtpInterval.current) {
                clearInterval(emailOtpInterval.current);
                emailOtpInterval.current = null;
            }
        };
    }, [emailOtpSent, emailOtpTimer]);

    const isValidPhone = (phone: string) => /^[6-9][0-9]{9}$/.test(phone);
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const checkStudentExists = async (phone: string, email: string) => {
        if (!phone && !email) return false;
        let url = "/api/students?";
        if (phone && email) {
            url += `where[or][0][phone][equals]=${encodeURIComponent(phone)}&where[or][1][email][equals]=${encodeURIComponent(email)}`;
        } else if (phone) {
            url += `where[phone][equals]=${encodeURIComponent(phone)}`;
        } else if (email) {
            url += `where[email][equals]=${encodeURIComponent(email)}`;
        }
        try {
            const res = await fetch(url);
            const data = await res.json();
            return data.docs && data.docs.length > 0;
        } catch {
            return false;
        }
    };

    const handleSendOtp = async (type: "phone" | "email") => {
        setError("");
        setSuccess("");
        if (type === "phone") {
            if (!isValidPhone(formData.phone)) {
                setError("Enter valid phone number.");
                return;
            }
            const exists = await checkStudentExists(formData.phone, "");
            if (exists) {
                setError("User already exists. Please login.");
                setShowLoginInstead(true);
                return;
            }
            setPhoneOtpSent(true);
            setPhoneOtpTimer(OTP_TIMER);
            setStage("phone-otp");
            await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone }),
            });
        } else {
            if (!isValidEmail(formData.email)) {
                setError("Enter valid email.");
                return;
            }
            const exists = await checkStudentExists("", formData.email);
            if (exists) {
                setError("User already exists. Please login.");
                setShowLoginInstead(true);
                return;
            }
            setEmailOtpSent(true);
            setEmailOtpTimer(OTP_TIMER);
            setStage("email-otp");
            await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
        }
    };

    const handleVerifyOtp = async (type: "phone" | "email") => {
        setError("");
        setSuccess("");
        const value = type === "phone" ? phoneOtp : emailOtp;
        let payload: any = { otp: value, medium: type };
        if (type === "phone") payload.phone = formData.phone;
        else payload.email = formData.email;
        const res = await fetch("/api/check-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.message === "OTP verified successfully") {
            setFieldVer((v) => ({ ...v, [type]: true }));
            setSuccess(type === "phone" ? "Phone verified!" : "Email verified!");
            setStage("fields");
        } else {
            setError(json.message || "OTP verification failed");
        }
    };

    const handleChangeField = (type: "phone" | "email") => {
        setFieldVer((v) => ({ ...v, [type]: false }));
        setStage("fields");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!fieldVer.phone || !fieldVer.email) {
            setError("Please verify phone and email.");
            setLoading(false);
            return;
        }

        const exists = await checkStudentExists(formData.phone, formData.email);
        if (exists) {
            setError("User already exists. Please login.");
            setShowLoginInstead(true);
            setLoading(false);
            return;
        }

        try {
            const password = Math.random().toString(36).slice(-8);
            const sendData = { ...formData, password, username: formData.email };
            const response = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sendData),
            });
            if (response.ok) {
                setSuccess("Registration successful! Logging you in...");

                // Send Welcome Email
                try {
                    await fetch("/api/sendWelcomeEmail", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: formData.email,
                            name: formData.name,
                            phone: formData.phone,
                            college: formData.college,
                            dept: formData.dept,
                            username: formData.email,
                            password: password,
                        }),
                    });
                } catch (err) {
                    // Optionally: setError("Registered, but failed to send welcome email.");
                }

                // Login the user after registration and welcome email
                const loginRes = await fetch("/api/students/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, password }),
                });
                if (loginRes.ok) {
                    const json = await loginRes.json();
                    localStorage.setItem("token", json.token);
                    localStorage.setItem("user", JSON.stringify(json.user));
                    router.push("/dashboard");
                } else {
                    setError("Registered, but failed to login. Please try logging in.");
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to register");
            }
        } catch (err: any) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    if (showLoginInstead) {
        return (
            <div>
                <div className="text-red-500 text-center mb-2">{error}</div>
                <LoginForm
                    onToggle={() => {
                        setShowLoginInstead(false);
                        setError("");
                    }}
                    prefillEmail={formData.email}
                    prefillPhone={formData.phone}
                />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <h2 className="text-lg font-bold mb-8 text-[#34c3ec]">Register</h2>
            {/* Name Field */}
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="name"
                    >
                        Full Name
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>
            </div>
            {/* Phone Field */}
            <div className="flex flex-wrap -mx-3 items-end phoneOut">
                <div className="w-full px-3 mb-6 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="phone"
                    >
                        Phone
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setFormData(f => ({
                                ...f,
                                phone: val.length > 10 ? val.slice(0, 10) : val
                            }));
                        }}
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        required
                        readOnly={fieldVer.phone}
                    />
                    {!fieldVer.phone && (
                        <button
                            type="button"
                            className="absolute right-3 top-9 px-3 py-1 rounded text-white font-bold bg-[#34c3ec] hover:bg-[#34b2d7]"
                            style={{
                                opacity: isValidPhone(formData.phone) && !phoneOtpSent ? 1 : 0.5,
                                transition: "background 0.2s",
                                zIndex: 2
                            }}
                            disabled={!isValidPhone(formData.phone) || phoneOtpSent}
                            onClick={() => handleSendOtp("phone")}
                        >Verify</button>
                    )}
                    {fieldVer.phone && (
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-xs underline text-[#34c3ec]"
                            style={{ zIndex: 2 }}
                            onClick={() => handleChangeField("phone")}
                        >Change</button>
                    )}
                    {(phoneOtpSent || phoneOtpTimer > 0) && !fieldVer.phone && (
                        <span
                            className="absolute right-3 top-3 text-xs font-semibold"
                            style={{
                                background: "#fff",
                                color: THEME_COLOR,
                                padding: "2px 8px",
                                borderRadius: "8px",
                                border: `1px solid ${THEME_COLOR}`,
                                pointerEvents: "none"
                            }}
                        >
                            {phoneOtpTimer > 0
                                ? `${Math.floor(phoneOtpTimer / 60)}:${(phoneOtpTimer % 60).toString().padStart(2, "0")}`
                                : <button
                                    type="button"
                                    className="text-[#34c3ec]"
                                    onClick={() => handleSendOtp("phone")}
                                >Resend</button>
                            }
                        </span>
                    )}
                    {stage === "phone-otp" && !fieldVer.phone && (
                        <div className="transition-all duration-300 mt-3">
                            <input
                                type="text"
                                placeholder="Enter Phone OTP"
                                value={phoneOtp}
                                onChange={e => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                                maxLength={6}
                                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                            <button
                                type="button"
                                className="w-full mt-2 bg-[#34c3ec] hover:bg-[#34b2d7] text-white font-bold py-2 px-4 rounded"
                                disabled={phoneOtp.length !== 6}
                                onClick={() => handleVerifyOtp("phone")}
                            >Verify OTP</button>
                        </div>
                    )}
                </div>
            </div>
            {/* Email Field */}
            <div className="flex flex-wrap -mx-3 items-end emailOut">
                <div className="w-full px-3 mb-6 relative">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        required
                        readOnly={fieldVer.email}
                    />
                    {!fieldVer.email && (
                        <button
                            type="button"
                            className="absolute right-3 top-9 px-3 py-1 rounded text-white font-bold bg-[#34c3ec] hover:bg-[#34b2d7]"
                            style={{
                                opacity: isValidEmail(formData.email) && !emailOtpSent ? 1 : 0.5,
                                transition: "background 0.2s",
                                zIndex: 2
                            }}
                            disabled={!isValidEmail(formData.email) || emailOtpSent}
                            onClick={() => handleSendOtp("email")}
                        >Verify</button>
                    )}
                    {fieldVer.email && (
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-xs underline text-[#34c3ec]"
                            style={{ zIndex: 2 }}
                            onClick={() => handleChangeField("email")}
                        >Change</button>
                    )}
                    {(emailOtpSent || emailOtpTimer > 0) && !fieldVer.email && (
                        <span
                            className="absolute right-3 top-3 text-xs font-semibold"
                            style={{
                                background: "#fff",
                                color: THEME_COLOR,
                                padding: "2px 8px",
                                borderRadius: "8px",
                                border: `1px solid ${THEME_COLOR}`,
                                pointerEvents: "none"
                            }}
                        >
                            {emailOtpTimer > 0
                                ? `${Math.floor(emailOtpTimer / 60)}:${(emailOtpTimer % 60).toString().padStart(2, "0")}`
                                : <button
                                    type="button"
                                    className="text-[#34c3ec]"
                                    onClick={() => handleSendOtp("email")}
                                >Resend</button>
                            }
                        </span>
                    )}
                    {stage === "email-otp" && !fieldVer.email && (
                        <div className="transition-all duration-300 mt-3">
                            <input
                                type="text"
                                placeholder="Enter Email OTP"
                                value={emailOtp}
                                onChange={e => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                                maxLength={6}
                                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            />
                            <button
                                type="button"
                                className="w-full mt-2 bg-[#34c3ec] hover:bg-[#34b2d7] text-white font-bold py-2 px-4 rounded"
                                disabled={emailOtp.length !== 6}
                                onClick={() => handleVerifyOtp("email")}
                            >Verify OTP</button>
                        </div>
                    )}
                </div>
            </div>
            {/* College Field */}
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="college"
                    >
                        College
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="college"
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={e => setFormData(f => ({ ...f, college: e.target.value }))}
                        required
                    />
                </div>
            </div>
            {/* Department Field */}
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="dept"
                    >
                        Department
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="dept"
                        type="text"
                        name="dept"
                        value={formData.dept}
                        onChange={e => setFormData(f => ({ ...f, dept: e.target.value }))}
                        required
                    />
                </div>
            </div>
            {/* Terms */}
            <div className="flex flex-wrap -mx-3 items-center mb-6">
                <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={e => setFormData(f => ({ ...f, terms: e.target.checked }))}
                    required
                />
                <label
                    className="ml-2 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                    htmlFor="terms"
                >
                    By Registering, you agree to our <a>Terms &amp; Conditions</a>.
                </label>
            </div>
            {/* Submit and errors */}
            {error && <div className="text-center text-red-500 mb-2">{error}</div>}
            {success && <div className="text-center text-green-600 mb-2">{success}</div>}
            <button
                type="submit"
                className="w-full bg-[#34c3ec] hover:bg-[#34b2d7] text-white font-bold py-2 px-4 rounded"
                disabled={loading || !fieldVer.phone || !fieldVer.email || !formData.terms}
            >
                {loading ? "Registering..." : "Register Now"}
            </button>
            <p className="mt-4 text-center">
                Already a user?{" "}
                <button type="button" className="text-[#34c3ec] underline font-medium" onClick={onToggle}>
                    Login
                </button>
            </p>
        </form>
    );
};
//src\app\(frontend)\components\LoginForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/utilities/toast";

const THEME_COLOR = "#34c3ec";
const OTP_TIMER = 120;

export const LoginForm = ({
    onToggle,
    prefillEmail = "",
    prefillPhone = "",
    showForgotPassword = true,
}: {
    onToggle: () => void;
    prefillEmail?: string;
    prefillPhone?: string;
    showForgotPassword?: boolean;
}) => {
    const [emailOrPhone, setEmailOrPhone] = useState(prefillEmail || prefillPhone || "");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState<"input" | "otp" | "reset" | "done">("input");
    const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState("");
    const [forgotOtp, setForgotOtp] = useState("");
    const [forgotOtpSent, setForgotOtpSent] = useState(false);
    const [forgotOtpTimer, setForgotOtpTimer] = useState(0);
    const forgotOtpInterval = useRef<NodeJS.Timeout | null>(null);
    const [forgotNewPassword, setForgotNewPassword] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [forgotSuccess, setForgotSuccess] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (forgotOtpSent && forgotOtpTimer === 0) setForgotOtpSent(false);
        if (forgotOtpSent && forgotOtpTimer > 0 && !forgotOtpInterval.current) {
            forgotOtpInterval.current = setInterval(() => {
                setForgotOtpTimer((prev) => {
                    if (prev <= 1) {
                        if (forgotOtpInterval.current) clearInterval(forgotOtpInterval.current);
                        forgotOtpInterval.current = null;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (forgotOtpInterval.current) {
                clearInterval(forgotOtpInterval.current);
                forgotOtpInterval.current = null;
            }
        };
    }, [forgotOtpSent, forgotOtpTimer]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);
        let loginEmail = emailOrPhone.trim();
        if (/^[0-9]{10}$/.test(loginEmail)) {
            const res = await fetch(`/api/students?where[phone][equals]=${loginEmail}`);
            const data = await res.json();
            if (!data.docs || !data.docs[0]) {
                setErrorMessage("No user with this phone number");
                setLoading(false);
                return;
            }
            loginEmail = data.docs[0].email;
        }
        try {
            const res = await fetch("/api/students/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password }),
            });
            if (res.ok) {
                const json = await res.json();
                toast.success("Login successful! Welcome back!");
                setSuccessMessage("Login successful");
                localStorage.setItem("token", json.token);
                localStorage.setItem("user", JSON.stringify(json.user));
                // Dispatch authchange event so header, etc. update immediately
                window.dispatchEvent(new Event("authchange"));
                router.push("/dashboard");
            } else {
                const errorData = await res.json();
                const errorMessage = errorData.message || "Invalid credentials";
                toast.error(errorMessage);
                setErrorMessage(errorMessage);
            }
        } catch (error: any) {
            const errorMessage = "Error: " + error.message;
            toast.error(errorMessage);
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSendOtp = async () => {
        setForgotError("");
        setForgotSuccess("");
        setForgotLoading(true);
        const input = forgotEmailOrPhone.trim();
        const payload: any = {};
        if (/^[0-9]{10}$/.test(input)) payload.phone = input;
        else payload.email = input;

        try {
            const res = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("OTP sent successfully to your email/phone.");
                setForgotSuccess(json.message || "OTP sent successfully.");
                setForgotOtpSent(true);
                setForgotOtpTimer(OTP_TIMER);
                setForgotStep("otp");
            } else {
                const errorMessage = json.message || "Failed to send OTP";
                toast.error(errorMessage);
                setForgotError(errorMessage);
            }
        } catch (err: any) {
            const errorMessage = err.message || "Failed to send OTP";
            toast.error(errorMessage);
            setForgotError(errorMessage);
        } finally {
            setForgotLoading(false);
        }
    };

    const handleForgotVerifyOtp = async () => {
        setForgotError("");
        setForgotSuccess("");
        setForgotLoading(true);
        const input = forgotEmailOrPhone.trim();
        const payload: any = { otp: forgotOtp };
        if (/^[0-9]{10}$/.test(input)) {
            payload.medium = "phone";
            payload.phone = input;
        } else {
            payload.medium = "email";
            payload.email = input;
        }
        try {
            const res = await fetch("/api/check-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json.message === "OTP verified successfully") {
                toast.success("OTP verified successfully!");
                setForgotStep("reset");
                setForgotSuccess("OTP verified. Please enter new password.");
            } else {
                const errorMessage = json.message || "OTP verification failed";
                toast.error(errorMessage);
                setForgotError(errorMessage);
            }
        } catch (err: any) {
            const errorMessage = err.message || "OTP verification failed";
            toast.error(errorMessage);
            setForgotError(errorMessage);
        } finally {
            setForgotLoading(false);
        }
    };

    const handleForgotResetPassword = async () => {
        setForgotError("");
        setForgotSuccess("");
        setForgotLoading(true);
        const input = forgotEmailOrPhone.trim();
        const payload: any = { password: forgotNewPassword };
        if (/^[0-9]{10}$/.test(input)) payload.phone = input;
        else payload.email = input;

        try {
            const res = await fetch("/api/students/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Password reset successfully! You can now login with your new password.");
                setForgotSuccess("Password reset successfully! Please login.");
                setForgotStep("done");
            } else {
                const errorMessage = json.message || "Reset failed";
                toast.error(errorMessage);
                setForgotError(errorMessage);
            }
        } catch (err: any) {
            const errorMessage = err.message || "Reset failed";
            toast.error(errorMessage);
            setForgotError(errorMessage);
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-4 text-[#34c3ec]">Login</h2>
            <div className="mb-4">
                <label className="block mb-1">Email / Phone</label>
                <input
                    type="text"
                    className="w-full border rounded p-2 text-black"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                    type="password"
                    className="w-full border rounded p-2 text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#34c3ec] hover:bg-[#34b2d7] text-white p-2 rounded disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            {showForgotPassword && (
                <p className="mt-2 text-right">
                    <button
                        type="button"
                        className="text-sm underline text-[#34c3ec]"
                        onClick={() => setShowForgot(true)}
                    >
                        Forgot Password?
                    </button>
                </p>
            )}
            {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
            <p className="mt-4 text-center">
                New user?{" "}
                <button onClick={onToggle} className="text-[#34c3ec] underline font-medium">
                    Register now
                </button>
            </p>
            {/* Forgot password modal overlay */}
            {showForgot && (
                <div className="fixed z-50 inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative">
                        <button
                            className="absolute top-2 right-2 text-xl"
                            onClick={() => setShowForgot(false)}
                            aria-label="Close"
                        >&times;</button>
                        <h3 className="text-lg font-bold mb-2 text-[#34c3ec]">Forgot Password</h3>
                        {forgotStep === "input" && (
                            <>
                                <input
                                    type="text"
                                    value={forgotEmailOrPhone}
                                    onChange={e => setForgotEmailOrPhone(e.target.value)}
                                    placeholder="Email or Phone"
                                    className="w-full border rounded p-2 mb-3 text-black"
                                />
                                <button
                                    className="w-full mb-2 bg-[#34c3ec] text-white p-2 rounded disabled:opacity-50"
                                    onClick={handleForgotSendOtp}
                                    disabled={(forgotOtpSent && forgotOtpTimer > 0) || forgotLoading}
                                    type="button"
                                >
                                    {forgotLoading ? "Sending..." : 
                                     forgotOtpSent && forgotOtpTimer > 0
                                        ? `Resend in ${Math.floor(forgotOtpTimer / 60)}:${(forgotOtpTimer % 60).toString().padStart(2, "0")}`
                                        : "Send OTP"}
                                </button>
                            </>
                        )}
                        {forgotStep === "otp" && (
                            <>
                                <input
                                    type="text"
                                    value={forgotOtp}
                                    onChange={e => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                                    maxLength={6}
                                    placeholder="Enter OTP"
                                    className="w-full border rounded p-2 mb-3 text-black"
                                />
                                <button
                                    className="w-full mb-2 bg-[#34c3ec] text-white p-2 rounded disabled:opacity-50"
                                    type="button"
                                    disabled={forgotLoading}
                                    onClick={handleForgotVerifyOtp}
                                >{forgotLoading ? "Verifying..." : "Verify OTP"}</button>
                                <button
                                    className="text-xs underline text-[#34c3ec] disabled:opacity-50"
                                    type="button"
                                    disabled={forgotOtpTimer > 0 || forgotLoading}
                                    onClick={handleForgotSendOtp}
                                >
                                    {forgotLoading ? "Sending..." :
                                     forgotOtpTimer > 0
                                        ? `Resend in ${Math.floor(forgotOtpTimer / 60)}:${(forgotOtpTimer % 60).toString().padStart(2, "0")}`
                                        : "Resend OTP"}
                                </button>
                            </>
                        )}
                        {forgotStep === "reset" && (
                            <>
                                <input
                                    type="password"
                                    value={forgotNewPassword}
                                    onChange={e => setForgotNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    className="w-full border rounded p-2 mb-3 text-black"
                                />
                                <button
                                    className="w-full bg-[#34c3ec] text-white p-2 rounded disabled:opacity-50"
                                    type="button"
                                    disabled={forgotLoading}
                                    onClick={handleForgotResetPassword}
                                >{forgotLoading ? "Resetting..." : "Reset Password"}</button>
                            </>
                        )}
                        {forgotStep === "done" && (
                            <div className="text-green-600 text-center py-4">
                                Password reset successful! You may now log in.
                            </div>
                        )}
                        {forgotError && <div className="text-red-500 text-center mt-2">{forgotError}</div>}
                        {forgotSuccess && <div className="text-green-600 text-center mt-2">{forgotSuccess}</div>}
                    </div>
                </div>
            )}
        </form>
    );
};
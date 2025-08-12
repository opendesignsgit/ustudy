"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { RegisterForm } from "../components/RegisterForm";
import Footer from '@/components/Home/footer';

export default function RegisterPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [userType, setUserType] = useState<"student" | "university">("student");

    useEffect(() => {
        if (!loading && user) {
            // Redirect to dashboard if already logged in based on user type
            const dashboardRoute = userType === "student" ? "/dashboard" : "/university-dashboard";
            router.replace(dashboardRoute);
        }
    }, [user, loading, router, userType]);

    return (
        <article>
            <div
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
                style={{
                    background: "none",
                }}
            >
                {/* Blurred BG image layer */}
                <div
                    aria-hidden
                    className="absolute inset-0 z-0"
                    style={{
                        background: 'url("/api/media/file/Diploma%20in%20Business.jpg") center center/cover no-repeat',
                        filter: "blur(10px) brightness(0.7)",
                        transform: "scale(1.05)",
                        width: "100%",
                        height: "100%",
                    }}
                />
                {/* Overlay for slight dim if needed */}
                <div
                    aria-hidden
                    className="absolute inset-0 z-10"
                    style={{
                        background: "rgba(0,0,0,0.15)",
                    }}
                />
                {/* Centered form */}
                <div
                    className="relative z-20 backdrop-blur-md"
                    style={{
                        background: "rgba(255,255,255,0.85)",
                        borderRadius: "1rem",
                        boxShadow: "0 10px 40px 0 rgba(0,0,0,0.12)",
                        padding: "2.5rem 2rem",
                        maxWidth: 480,
                        width: "100%",
                        color: "#222",
                    }}
                >
                    {/* User Type Selection Tabs */}
                    <div className="mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 ${
                                    userType === "student"
                                        ? "border-[#34c3ec] text-[#34c3ec]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setUserType("student")}
                            >
                                Student Registration
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 ${
                                    userType === "university"
                                        ? "border-[#34c3ec] text-[#34c3ec]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setUserType("university")}
                            >
                                University Registration
                            </button>
                        </div>
                    </div>
                    
                    <RegisterForm 
                        onToggle={() => (window.location.href = "/login")} 
                        userType={userType}
                    />
                </div>
            </div>

            <Footer></Footer>
        </article>
    );
}
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { RegisterForm } from "../components/RegisterForm";
import Footer from '@/components/Home/footer';

export default function RegisterPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            // Redirect to dashboard if already logged in
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

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
                    <RegisterForm onToggle={() => (window.location.href = "/login")} />
                </div>
            </div>

            <Footer></Footer>
        </article>
    );
}
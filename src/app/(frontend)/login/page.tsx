"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { LoginForm } from "../components/LoginForm";
import Footer from '@/components/Home/footer';

export default function LoginPage() {
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
        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{
            background: "rgba(0,0,0,0.15)",
          }}
        />
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
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Login As:
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as "student" | "university")}
              className="w-full border rounded p-2 text-black bg-white"
            >
              <option value="student">Student</option>
              <option value="university">University</option>
            </select>
          </div>
          
          <LoginForm 
            onToggle={() => (window.location.href = "/register")} 
            userType={userType}
          />
        </div>
      </div>
      <Footer></Footer>
    </article>
  );
}
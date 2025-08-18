"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/providers/Auth';
import MainPage from "../components/WelcomePage";
import AccountDetails from "../components/AccountDetailsPage";
import CoursesMenu from "../components/CoursesPage";
import Footer from '@/components/Home/footer'
import './style.scss'

export default function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState<
    "main" | "account" | "courses"
  >("main");
  const router = useRouter();
  const { user, logout: authLogout, loading } = useAuth();

  // Sync tab from URL on mount and when popstate occurs
  useEffect(() => {
    const getTab = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        switch (tab) {
          case 'my-account':
            setSelectedComponent('account');
            break;
          case 'my-courses':
            setSelectedComponent('courses');
            break;
          default:
            setSelectedComponent('main');
        }
      }
    };

    getTab();
    window.addEventListener('popstate', getTab);

    return () => window.removeEventListener('popstate', getTab);
  }, []);

  // On auth state: redirect if not logged in or not a student
  useEffect(() => {
    if (!loading && (!user || userType !== 'student')) {
      router.push('/login');
      return;
    }
  }, [user, userType, loading, router]);

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTabChange = (tab: "main" | "account" | "courses") => {
    setSelectedComponent(tab);
    let param = '';
    if (tab === 'account') param = 'my-account';
    if (tab === 'courses') param = 'my-courses';
    // ReplaceState to update query string without reload
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      const url = param ? `${base}?tab=${param}` : base;
      window.history.pushState({}, '', url);
      // Optionally, trigger the tab change logic again to ensure sync
      // but useEffect with popstate will handle it
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!user || userType !== 'student') return null; // Will redirect via useEffect

    switch (selectedComponent) {
      case "main":
        return <MainPage />;
      case "account":
        return <AccountDetails />;
      case "courses":
        return <CoursesMenu />;
      default:
        return <MainPage />;
    }
  };

  const menuItemClass = (component: "main" | "account" | "courses") =>
    `cursor-pointer p-2 rounded hover:bg-gray-300 ${selectedComponent === component ? "bg-gray-300 font-bold" : ""
    }`;

  return (
    <article>
      <div className="dashboard-container flex h-screen">
        <aside className="w-64 bg-gray-800 p-4 text-white">
          <nav>
            <ul className="space-y-2">
              <li
                className={menuItemClass("main")}
                onClick={() => handleTabChange("main")}
              >
                Home
              </li>
              <li
                className={menuItemClass("account")}
                onClick={() => handleTabChange("account")}
              >
                Account Details
              </li>
              <li
                className={menuItemClass("courses")}
                onClick={() => handleTabChange("courses")}
              >
                My Courses
              </li>
              <li
                className="cursor-pointer p-2 rounded hover:bg-gray-700 text-red-400"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto bg-gray-50 text-gray-900">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </article>
  );
}
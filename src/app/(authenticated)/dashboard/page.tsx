// /app/(authenticated)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from '@/providers/Auth';
import MainPage from "../components/WelcomePage";
import AccountDetails from "../components/AccountDetailsPage";
import CoursesMenu from "../components/CoursesPage";
import Footer from '@/components/Home/footer'
import './style.scss'

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [selectedComponent, setSelectedComponent] = useState<
    "main" | "account" | "courses"
  >("main");
  const router = useRouter();
  const { user, logout: authLogout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const tab = searchParams?.get('tab');
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
  }, [searchParams]);

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
    router.push(`/dashboard?tab=${param}`);
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!user) return <div className="text-center py-8">Unauthorized</div>;

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
      <Footer></Footer>
    </article>
  );
}
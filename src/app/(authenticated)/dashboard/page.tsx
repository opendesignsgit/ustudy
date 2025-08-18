"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/providers/Auth';
import MainPage from "../components/WelcomePage";
import AccountDetails from "../components/AccountDetailsPage";
import CoursesMenu from "../components/CoursesPage";
import Footer from '@/components/Home/footer'
import './style.scss'

// Import university dashboard components
import { UniversityAccountDetails } from '../components/UniversityAccountDetails';
import { UniversityContentEditor } from '../components/UniversityContentEditor';
import { UniversityPageView } from '../components/UniversityPageView';

export default function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState<
    "main" | "account" | "courses" | "content" | "view"
  >("main");
  const router = useRouter();
  const { user, universityUser, userType, logout: authLogout, loading } = useAuth();
  const [universityData, setUniversityData] = useState<any>(null);

  // Sync tab from URL on mount and when popstate occurs
  useEffect(() => {
    const getTab = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        switch (tab) {
          case 'my-account':
          case 'account':
            setSelectedComponent('account');
            break;
          case 'my-courses':
            setSelectedComponent('courses');
            break;
          case 'content':
            setSelectedComponent('content');
            break;
          case 'view':
            setSelectedComponent('view');
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

  // Immediate redirect if not authenticated - don't load content first
  useEffect(() => {
    if (!loading && !user && !universityUser) {
      router.replace('/login');
      return;
    }
  }, [user, universityUser, loading, router]);

  // Fetch university data for university users
  useEffect(() => {
    const fetchUniversityData = async () => {
      if (userType !== "university" || !universityUser) return;
      
      try {
        const token = localStorage.getItem("token");
        
        if (token) {
          // Try to fetch current user data to get university ID
          const userResponse = await fetch('/api/universities/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (userResponse.ok) {
            const currentUser = await userResponse.json();
            setUniversityData(currentUser);
            // Update localStorage with fresh data
            localStorage.setItem("universityUser", JSON.stringify(currentUser));
          } else {
            // Fallback to stored university data
            setUniversityData(universityUser);
          }
        } else {
          // Fallback to stored university data
          setUniversityData(universityUser);
        }
      } catch (error) {
        console.error("Error fetching university data:", error);
        // Fallback to stored university data
        setUniversityData(universityUser);
      }
    };

    if (userType === "university") {
      fetchUniversityData();
    }
  }, [userType, universityUser]);

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTabChange = (tab: "main" | "account" | "courses" | "content" | "view") => {
    setSelectedComponent(tab);
    let param = '';
    if (tab === 'account') param = userType === 'student' ? 'my-account' : 'account';
    if (tab === 'courses') param = 'my-courses';
    if (tab === 'content') param = 'content';
    if (tab === 'view') param = 'view';
    // ReplaceState to update query string without reload
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      const url = param ? `${base}?tab=${param}` : base;
      window.history.pushState({}, '', url);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (!user && !universityUser) return <div className="text-center py-8">Redirecting to login...</div>;

    // Handle university dashboard components
    if (userType === 'university') {
      switch (selectedComponent) {
        case "main":
        case "account":
          return <UniversityAccountDetails universityData={universityData} />;
        case "content":
          return <UniversityContentEditor universityData={universityData} />;
        case "view":
          return <UniversityPageView universityData={universityData} />;
        default:
          return <UniversityAccountDetails universityData={universityData} />;
      }
    }

    // Handle student dashboard components
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

  const menuItemClass = (component: "main" | "account" | "courses" | "content" | "view") =>
    `cursor-pointer p-2 rounded hover:bg-gray-300 ${selectedComponent === component ? "bg-gray-300 font-bold" : ""
    }`;

  // Don't render anything if not authenticated - immediate redirect
  if (!user && !universityUser && !loading) {
    return null;
  }

  return (
    <article>
      <div className="dashboard-container flex h-screen">
        <aside className="w-64 bg-gray-800 p-4 text-white">
          {userType === 'university' && universityData && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#34c3ec]">
                {universityData.title || "University"}
              </h2>
              <p className="text-sm text-gray-300">Dashboard</p>
            </div>
          )}
          
          <nav>
            <ul className="space-y-2">
              {userType === 'student' ? (
                <>
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
                </>
              ) : (
                <>
                  <li
                    className={menuItemClass("account")}
                    onClick={() => handleTabChange("account")}
                  >
                    Account Details
                  </li>
                  <li
                    className={menuItemClass("content")}
                    onClick={() => handleTabChange("content")}
                  >
                    Content Editor
                  </li>
                  <li
                    className={menuItemClass("view")}
                    onClick={() => handleTabChange("view")}
                  >
                    View University Page
                  </li>
                </>
              )}
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
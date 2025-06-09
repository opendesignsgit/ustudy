"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import MainPage from "../components/WelcomePage";
import AccountDetails from "../components/AccountDetailsPage";
import CoursesMenu from "../components/CoursesPage";

import './style.scss'
export default function Dashboard() {
  // Default to 'courses'
  const [selectedComponent, setSelectedComponent] = useState<
    "main" | "account" | "courses"
  >("courses");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/students/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        console.error("Failed to logout", await res.json());
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  const renderContent = () => {
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
    <div className="dashboard-container flex h-screen">
      <aside className="w-64 bg-gray-200 p-4">
        <nav>
          <ul className="space-y-2">
            <li
              className={menuItemClass("main")}
              onClick={() => setSelectedComponent("main")}
            >
              Home
            </li>
            <li
              className={menuItemClass("account")}
              onClick={() => setSelectedComponent("account")}
            >
              Account Details
            </li>
            <li
              className={menuItemClass("courses")}
              onClick={() => setSelectedComponent("courses")}
            >
              My Courses
            </li>
            <li
              className="cursor-pointer p-2 rounded hover:bg-gray-300 text-red-600"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
    </div>
  );
}

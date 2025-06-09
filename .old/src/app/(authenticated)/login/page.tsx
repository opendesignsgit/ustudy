"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { LoginFormModal } from "@/components/LoginFormModal";
import './style.scss'

// -------------------- Login Form --------------------

const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        setSuccessMessage("Login successful");
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        // Redirect to the dashboard after successful login
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Invalid credentials");
      }
    } catch (error: any) {
      setErrorMessage("Error: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 sticky top-0 login-register Mainlogin">
      <form onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      <p className="mt-4 text-center">
        New user?{" "}
        <button onClick={onToggle} className="text-blue-500 underline">
          Register now
        </button>
      </p>
    </div>
  );
};

// -------------------- Register Form (with OTP functions) --------------------

const RegisterForm = ({ onToggle }: { onToggle: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    college: "",
    dept: "",
    terms: false,
    otp: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("in");
  const [showPhoneOTPButton, setShowPhoneOTPButton] = useState(false);
  const [showEmailOTPButton, setShowEmailOTPButton] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpTimerCount, setPhoneOtpTimerCount] = useState(0);
  const [emailOtpTimerCount, setEmailOtpTimerCount] = useState(0);
  const phoneOtpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const emailOtpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Separate OTP states for phone and email
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  // Check if customer is already logged in
  useEffect(() => {
    const checkCustomerLoggedInStatus = async () => {
      try {
        const response = await fetch('/api/students/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const result = await response.json();
          if (result.token) {
            setIsLoggedIn(true);
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking logged in status:', error);
        setIsLoggedIn(false);
      }
    };

    checkCustomerLoggedInStatus();
  }, []);

  // Validate phone number and show OTP button if valid
  useEffect(() => {
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (
      selectedCountry === "in" &&
      phoneDigits.length === 10 &&
      /^[6-9]/.test(phoneDigits)
    ) {
      setShowPhoneOTPButton(true);
    } else {
      setShowPhoneOTPButton(false);
    }
  }, [selectedCountry, formData.phone]);

  // Clear phone field when country changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, phone: "" }));
  }, [selectedCountry]);

  // Validate email format and show OTP button if valid
  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(formData.email)) {
      setShowEmailOTPButton(true);
    } else {
      setShowEmailOTPButton(false);
    }
  }, [formData.email]);

  const handlePhoneNumberChange = (
    isValid: boolean,
    value: string,
    countryData: any,
    number: string,
    id: string
  ) => {
    setSelectedCountry(countryData.iso2);
    let cleanedValue = value;
    if (countryData.iso2 === "in") {
      cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.length > 0 && !/^[6-9]/.test(cleanedValue)) {
        cleanedValue = cleanedValue.substring(1);
      }
      if (cleanedValue.length > 10) {
        cleanedValue = cleanedValue.substring(0, 10);
      }
    }
    setFormData(prev => ({ ...prev, phone: cleanedValue }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const startOTPTimer = (
    duration: number,
    setOtpTimerCount: React.Dispatch<React.SetStateAction<number>>,
    otpIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    setOtpTimerCount(duration);
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
    }
    otpIntervalRef.current = setInterval(() => {
      setOtpTimerCount(prev => {
        if (prev <= 1) {
          if (otpIntervalRef.current) clearInterval(otpIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendPhoneOTP = async () => {
    if (!showPhoneOTPButton) return;
    setErrorMessage("");
    setSuccessMessage("");
    const phone = formData.phone.trim();

    try {
      const response = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || "OTP sent successfully.");
        setPhoneOtpSent(true);
        startOTPTimer(120, setPhoneOtpTimerCount, phoneOtpIntervalRef);
      } else {
        setErrorMessage(result.message || "Failed to send OTP.");
        setPhoneOtpSent(false);
      }
    } catch (error: any) {
      setErrorMessage("Error: " + error.message);
      setPhoneOtpSent(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!showEmailOTPButton) return;
    setErrorMessage("");
    setSuccessMessage("");
    const email = formData.email.trim();

    try {
      const response = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || "OTP sent successfully.");
        setEmailOtpSent(true);
        startOTPTimer(120, setEmailOtpTimerCount, emailOtpIntervalRef);
      } else {
        setErrorMessage(result.message || "Failed to send OTP.");
        setEmailOtpSent(false);
      }
    } catch (error: any) {
      setErrorMessage("Error: " + error.message);
      setEmailOtpSent(false);
    }
  };

  const handlePhoneOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setPhoneOtp(value);
    }
    if (value.length === 6) {
      checkOTP(value, "phone");
    }
  };

  const handleEmailOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setEmailOtp(value);
    }
    if (value.length === 6) {
      checkOTP(value, "email");
    }
  };

  const checkOTP = async (otp: string, medium: "phone" | "email") => {
    let payload = {};
    if (medium === "phone") {
      payload = { medium: "phone", phone: formData.phone.trim(), otp };
    } else if (medium === "email") {
      payload = { medium: "email", email: formData.email.trim(), otp };
    }

    try {
      const response = await fetch("/api/check-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.message === "OTP verified successfully") {
        if (medium === "phone") {
          clearInterval(phoneOtpIntervalRef.current!);
          setPhoneOtpTimerCount(0);
          setIsPhoneVerified(true);
          localStorage.setItem("is_phone_verified", "1");
        } else if (medium === "email") {
          clearInterval(emailOtpIntervalRef.current!);
          setEmailOtpTimerCount(0);
          setIsEmailVerified(true);
          localStorage.setItem("is_email_verified", "1");
        }
      } else {
        if (medium === "phone") {
          setIsPhoneVerified(false);
          localStorage.setItem("is_phone_verified", "0");
        } else if (medium === "email") {
          setIsEmailVerified(false);
          localStorage.setItem("is_email_verified", "0");
        }
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message);
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPhoneVerified && selectedCountry === "in") {
      setErrorMessage("Please verify your phone number before enrolling.");
      return;
    }
    if (!isEmailVerified) {
      setErrorMessage("Please verify your email before enrolling.");
      return;
    }
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const password = generatePassword();
    const username = formData.email;
    const formDataWithPassword = { ...formData, password, username };

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataWithPassword),
      });
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("User created successfully");
        setIsLoggedIn(true);
        // Send welcome email
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
      } else {
        const errorData = await response.json();
        // If the error indicates that the email already exists, toggle to the login form.
        if (
          errorData.errors &&
          errorData.errors[0].name === "ValidationError" &&
          errorData.errors[0].data.errors[0].path === "email"
        ) {
          setErrorMessage("User already exists. Redirecting to login...");
          onToggle();
        } else {
          setErrorMessage(errorData.error || "Failed to create user");
        }
      }
    } catch (error: any) {
      setErrorMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/students/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        setIsLoginModalOpen(false);
        setSuccessMessage("Login successful");
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || "Invalid credentials");
      }
    } catch (error: any) {
      setErrorMessage("Error: " + error.message);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-lg font-bold mb-8">You are already logged in.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sticky top-0 login-register Mainregister">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <h2 className="text-lg font-bold mb-8">Register</h2>
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* Phone Field */}
        <div className="flex flex-wrap -mx-3 items-end phoneOut">
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            {!phoneOtpSent && !isPhoneVerified && (
              <IntlTelInput
                containerClassName="intl-tel-input"
                inputClassName="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                fieldName="phone"
                value={formData.phone}
                onPhoneNumberChange={handlePhoneNumberChange}
                formatOnInit={true}
                preferredCountries={["in", "us"]}
                autoHideDialCode={true}
                separateDialCode={true}
              />
            )}
            {phoneOtpSent && !isPhoneVerified && (
              <input
                id="phone-otp"
                type="text"
                placeholder="Enter Phone OTP"
                value={phoneOtp}
                onChange={handlePhoneOtpChange}
                maxLength={6}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
              />
            )}
            {isPhoneVerified && (
              <input
                type="text"
                value={formData.phone}
                readOnly
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            )}
          </div>
          {!phoneOtpSent && !isPhoneVerified && showPhoneOTPButton && (
            <div className="px-3 mb-6 verify verifyPhone">
              <button
                type="button"
                onClick={handleSendPhoneOTP}
                disabled={phoneOtpTimerCount > 0}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {phoneOtpTimerCount > 0
                  ? `${Math.floor(phoneOtpTimerCount / 60)
                    .toString()
                    .padStart(2, "0")}:${(phoneOtpTimerCount % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "Verify"}
              </button>
            </div>
          )}
        </div>
        {/* Email Field */}
        <div className="flex flex-wrap -mx-3 items-end emailOut">
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            {!emailOtpSent && !isEmailVerified && (
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
              />
            )}
            {emailOtpSent && !isEmailVerified && (
              <input
                id="email-otp"
                type="text"
                placeholder="Enter Email OTP"
                value={emailOtp}
                onChange={handleEmailOtpChange}
                maxLength={6}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
              />
            )}
            {isEmailVerified && (
              <input
                type="text"
                value={formData.email}
                readOnly
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            )}
          </div>
          {!emailOtpSent && !isEmailVerified && showEmailOTPButton && (
            <div className="px-3 mb-6 verify verifyEmail">
              <button
                type="button"
                onClick={handleSendEmailOTP}
                disabled={emailOtpTimerCount > 0}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {emailOtpTimerCount > 0
                  ? `${Math.floor(emailOtpTimerCount / 60)
                    .toString()
                    .padStart(2, "0")}:${(emailOtpTimerCount % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "Verify"}
              </button>
            </div>
          )}
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="college"
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="dept"
              type="text"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
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
            onChange={handleChange}
            required
          />
          <label
            className="ml-2 block uppercase tracking-wide text-gray-700 text-xs font-bold"
            htmlFor="terms"
          >
            By enrolling, you agree to our Terms &amp; Conditions.
          </label>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#00a44f] hover:bg-[#00a44f] text-white font-bold py-2 px-4 rounded"
          disabled={loading || (!isPhoneVerified && selectedCountry === "in") || !isEmailVerified}
        >
          Enroll Now
        </button>
        {loading && <div className="text-center">Loading...</div>}
        {successMessage && <div className="text-center text-green-500">{successMessage}</div>}
        {errorMessage && <div className="text-center text-red-500">{errorMessage}</div>}
      </form>
      {/* <LoginFormModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        email={formData.email}
      /> */}
    </div>
  );
};

// -------------------- AuthForm Toggle with Logged-In Check --------------------

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in by checking for a token in localStorage.
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const toggleForm = () => setIsRegister((prev) => !prev);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {isRegister ? <RegisterForm onToggle={toggleForm} /> : <LoginForm onToggle={toggleForm} />}
    </div>
  );
}
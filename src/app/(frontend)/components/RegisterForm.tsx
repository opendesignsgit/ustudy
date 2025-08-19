//src\app\(frontend)\components\RegisterForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "./LoginForm";

const THEME_COLOR = "#34c3ec";
const OTP_TIMER = 120;

export const RegisterForm = ({ 
    onToggle, 
    userType = "student" 
}: { 
    onToggle: () => void;
    userType?: "student" | "university";
}) => {
    const [formData, setFormData] = useState<any>(
        userType === "student" 
            ? {
                name: "",
                phone: "",
                email: "",
                college: "",
                dept: "",
                terms: false,
              }
            : {
                title: "",
                phone: "",
                email: "",
                country: "",
                websiteUrl: "",
                description: "",
                template: "",
                terms: false,
              }
    );
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
    const [templates, setTemplates] = useState<any[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [countries, setCountries] = useState<any[]>([]);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoUploading, setLogoUploading] = useState(false);
    const router = useRouter();

    // Fetch university templates and countries if userType is university
    useEffect(() => {
        if (userType === "university") {
            // Fetch templates
            setTemplatesLoading(true);
            fetch("/api/university-templates?where[status][equals]=active")
                .then(res => res.json())
                .then(data => {
                    setTemplates(data.docs || []);
                })
                .catch(err => {
                    console.error("Failed to fetch templates:", err);
                })
                .finally(() => {
                    setTemplatesLoading(false);
                });

            // Fetch countries
            setCountriesLoading(true);
            fetch("/api/countries")
                .then(res => res.json())
                .then(data => {
                    setCountries(data.docs || []);
                })
                .catch(err => {
                    console.error("Failed to fetch countries:", err);
                })
                .finally(() => {
                    setCountriesLoading(false);
                });
        }
    }, [userType]);

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
        const collection = userType === "student" ? "students" : "universities";
        let url = `/api/${collection}?`;
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

    const uploadLogo = async (file: File): Promise<string | null> => {
        setLogoUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.doc.id;
            } else {
                throw new Error('Failed to upload logo');
            }
        } catch (error) {
            console.error('Logo upload error:', error);
            throw error;
        } finally {
            setLogoUploading(false);
        }
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

        // For universities, check if logo is provided
        if (userType === "university" && !logoFile) {
            setError("University logo is required.");
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
            let sendData = { ...formData, password, username: formData.email };
            
            // Ensure country is properly formatted for universities
            if (userType === "university" && sendData.country) {
                // Convert to number and validate
                const countryId = parseInt(sendData.country);
                if (!isNaN(countryId) && countryId > 0) {
                    sendData.country = countryId;
                } else {
                    setError("Please select a valid country.");
                    setLoading(false);
                    return;
                }
            }
            
            // Upload logo for university registration
            if (userType === "university" && logoFile) {
                try {
                    const logoId = await uploadLogo(logoFile);
                    sendData = { ...sendData, logo: logoId };
                } catch (error) {
                    setError("Failed to upload logo. Please try again.");
                    setLoading(false);
                    return;
                }
            }
            
            const collection = userType === "student" ? "students" : "universities";
            const response = await fetch(`/api/${collection}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sendData),
            });
            if (response.ok) {
                setSuccess("Registration successful! Logging you in...");

                // Send Welcome Email
                try {
                    const emailEndpoint = userType === "student" ? "/api/sendWelcomeEmail" : "/api/sendUniversityWelcomeEmail";
                    const emailData = userType === "student"
                        ? {
                            email: formData.email,
                            name: (formData as any).name,
                            phone: formData.phone,
                            college: (formData as any).college,
                            dept: (formData as any).dept,
                            username: formData.email,
                            password: password,
                          }
                        : {
                            email: formData.email,
                            title: (formData as any).title,
                            phone: formData.phone,
                            username: formData.email,
                            password: password,
                          };

                    await fetch(emailEndpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(emailData),
                    });
                } catch (err) {
                    // Optionally: setError("Registered, but failed to send welcome email.");
                }

                // Login the user after registration and welcome email
                const loginEndpoint = userType === "student" ? "/api/students/login" : "/api/universities/login";
                const loginRes = await fetch(loginEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, password }),
                });
                if (loginRes.ok) {
                    const json = await loginRes.json();
                    localStorage.setItem("token", json.token);
                    localStorage.setItem("userType", userType);
                    
                    if (userType === "student") {
                        localStorage.setItem("user", JSON.stringify(json.user));
                    } else {
                        localStorage.setItem("universityUser", JSON.stringify(json.user));
                    }
                    
                    // Redirect to unified dashboard
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
                    userType={userType}
                />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <h2 className="text-lg font-bold mb-8 text-[#34c3ec]">
                {userType === "student" ? "Student Registration" : "University Registration"}
            </h2>
            {/* Name/Title Field */}
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor={userType === "student" ? "name" : "title"}
                    >
                        {userType === "student" ? "Full Name" : "University Name"}
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={userType === "student" ? "name" : "title"}
                        type="text"
                        name={userType === "student" ? "name" : "title"}
                        value={userType === "student" ? (formData as any).name : (formData as any).title}
                        onChange={e => setFormData(f => ({ ...f, [userType === "student" ? "name" : "title"]: e.target.value }))}
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
            {/* College/Country Field */}
            {userType === "student" ? (
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
                            value={(formData as any).college}
                            onChange={e => setFormData(f => ({ ...f, college: e.target.value }))}
                            required
                        />
                    </div>
                </div>
            ) : (
                <>
                    {/* Logo Upload Field */}
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3 mb-6">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="logo"
                            >
                                University Logo *
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setLogoFile(file);
                                    }
                                }}
                                required
                            />
                            {logoFile && (
                                <p className="text-xs text-gray-600 mt-1">
                                    Selected: {logoFile.name}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Country Dropdown */}
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3 mb-6">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="country"
                            >
                                Country *
                            </label>
                            {countriesLoading ? (
                                <div className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight">
                                    Loading countries...
                                </div>
                            ) : (
                                <select
                                    className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="country"
                                    name="country"
                                    value={(formData as any).country}
                                    onChange={e => setFormData(f => ({ ...f, country: e.target.value }))}
                                    required
                                >
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </>
            )}
            {/* Department/Website Field */}
            {userType === "student" ? (
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
                            value={(formData as any).dept}
                            onChange={e => setFormData(f => ({ ...f, dept: e.target.value }))}
                            required
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3 mb-6">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="websiteUrl"
                            >
                                Website URL (Optional)
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="websiteUrl"
                                type="url"
                                name="websiteUrl"
                                value={(formData as any).websiteUrl}
                                onChange={e => setFormData(f => ({ ...f, websiteUrl: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3 mb-6">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="description"
                            >
                                University Description (Optional)
                            </label>
                            <textarea
                                className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="description"
                                name="description"
                                rows={3}
                                value={(formData as any).description}
                                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    {/* Template Selection */}
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full px-3 mb-6">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="template"
                            >
                                University Template (Optional)
                            </label>
                            {templatesLoading ? (
                                <div className="text-center py-4 text-gray-500">Loading templates...</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                (formData as any).template === template.id
                                                    ? "border-[#34c3ec] bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => setFormData(f => ({ ...f, template: template.id }))}
                                        >
                                            {template.previewImage && (
                                                <img
                                                    src={template.previewImage.url || `/api/media/file/${template.previewImage.filename}`}
                                                    alt={template.title}
                                                    className="w-full h-32 object-cover rounded mb-2"
                                                />
                                            )}
                                            <h4 className="font-semibold text-sm">{template.title}</h4>
                                            {template.description && (
                                                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                                            )}
                                        </div>
                                    ))}
                                    {/* None option */}
                                    <div
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                            !(formData as any).template
                                                ? "border-[#34c3ec] bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                        onClick={() => setFormData(f => ({ ...f, template: "" }))}
                                    >
                                        <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                                            <span className="text-gray-400">No Template</span>
                                        </div>
                                        <h4 className="font-semibold text-sm">None</h4>
                                        <p className="text-xs text-gray-600 mt-1">Start with a blank page</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
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
                disabled={loading || logoUploading || !fieldVer.phone || !fieldVer.email || !formData.terms || (userType === "university" && !logoFile)}
            >
                {loading ? "Registering..." : logoUploading ? "Uploading logo..." : `Register as ${userType === "student" ? "Student" : "University"}`}
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
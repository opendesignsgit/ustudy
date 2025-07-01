// /(authenticated)/components/CoursesPage.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/Auth';

const THEME_COLOR = "#34c3ec";
const OTP_TIMER = 120;

export default function AccountDetails() {
  const { user, refreshUser, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);

  // Original account data (for comparison)
  const [original, setOriginal] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    dept: "",
    profilePic: "",
    is_mobile_verified: false,
    is_email_verified: false,
  });

  // Form data (editable)
  const [formData, setFormData] = useState(original);

  // Fields that are in "change" mode
  const [editField, setEditField] = useState<{ phone: boolean; email: boolean }>({ phone: false, email: false });

  // OTP states
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpTimer, setPhoneOtpTimer] = useState(0);
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const phoneOtpInterval = useRef<NodeJS.Timeout | null>(null);
  const emailOtpInterval = useRef<NodeJS.Timeout | null>(null);

  // Verification states
  const [fieldVer, setFieldVer] = useState<{ phone: boolean; email: boolean }>({ phone: false, email: false });

  // Other UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync with Auth context
  useEffect(() => {
    if (user && user.user) {
      setOriginal({
        name: user.user.name || "",
        email: user.user.email || "",
        phone: user.user.phone || "",
        college: user.user.college || "",
        dept: user.user.dept || "",
        profilePic: user.user.profilePic || "",
        is_mobile_verified: user.user.is_mobile_verified || false,
        is_email_verified: user.user.is_email_verified || false,
      });
      setFormData({
        name: user.user.name || "",
        email: user.user.email || "",
        phone: user.user.phone || "",
        college: user.user.college || "",
        dept: user.user.dept || "",
        profilePic: user.user.profilePic || "",
        is_mobile_verified: user.user.is_mobile_verified || false,
        is_email_verified: user.user.is_email_verified || false,
      });
      setFieldVer({
        phone: user.user.is_mobile_verified || false,
        email: user.user.is_email_verified || false,
      });
      setEditField({ phone: false, email: false });
    }
  }, [user]);

  // OTP timer logic
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

  // Send OTP only if value changed
  const handleSendOtp = async (type: "phone" | "email") => {
    setError(""); setSuccess("");
    if (type === "phone") {
      if (!isValidPhone(formData.phone)) {
        setError("Enter valid phone number.");
        return;
      }
      if (formData.phone === original.phone) {
        setError("Phone number not changed.");
        return;
      }
      setPhoneOtpSent(true);
      setPhoneOtpTimer(OTP_TIMER);
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ phone: formData.phone, purpose: "verification" }),
      });
    } else {
      if (!isValidEmail(formData.email)) {
        setError("Enter valid email.");
        return;
      }
      if (formData.email === original.email) {
        setError("Email not changed.");
        return;
      }
      setEmailOtpSent(true);
      setEmailOtpTimer(OTP_TIMER);
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ email: formData.email, purpose: "verification" }),
      });
    }
  };

  // Only hide OTP field after successful verification
  const handleVerifyOtp = async (type: "phone" | "email") => {
    setError(""); setSuccess("");
    const value = type === "phone" ? phoneOtp : emailOtp;
    let payload: any = { otp: value, medium: type };
    if (type === "phone") payload.phone = formData.phone;
    else payload.email = formData.email;
    const res = await fetch("/api/check-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json && res.ok) {
      setFieldVer((v) => ({ ...v, [type]: true }));
      setSuccess(type === "phone" ? "Phone verified!" : "Email verified!");
      setEditField((v) => ({ ...v, [type]: false }));
      if (type === "phone") {
        setPhoneOtp("");
        setPhoneOtpSent(false); // Only hide OTP field on success
      } else {
        setEmailOtp("");
        setEmailOtpSent(false); // Only hide OTP field on success
      }
    } else {
      setError(json.message || "OTP verification failed");
      // Do NOT hide the OTP input on failure!
    }
  };

  const handleChangeField = (type: "phone" | "email") => {
    setEditField((v) => ({ ...v, [type]: true }));
    setFieldVer((v) => ({ ...v, [type]: false }));
    if (type === "phone") setPhoneOtp(""); else setEmailOtp("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    // For phone/email changed, must be verified
    if (
      (formData.phone !== original.phone && !fieldVer.phone) ||
      (formData.email !== original.email && !fieldVer.email)
    ) {
      setError("Please verify changed phone and email.");
      setLoading(false);
      return;
    }
    try {
      await updateUser({
        id: user.user.id,
        ...formData,
        is_mobile_verified: fieldVer.phone,
        is_email_verified: fieldVer.email,
      });
      setSuccess("Profile updated successfully!");
      setEditing(false);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Account Details</h1>

      {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-800">{error}</div>}
      {success && <div className="mb-4 p-3 rounded bg-green-100 text-green-800">{success}</div>}

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="block mb-1">Name:
              <input
                name="name"
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                className="border p-2 w-full rounded"
                required
              />
            </label>
          </div>

          {/* Phone Field with "Change" and OTP */}
          <div className="relative mb-6">
            <label className="block mb-1">Phone:</label>
            <div className="relative w-full">
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setFormData(f => ({
                    ...f,
                    phone: val.length > 10 ? val.slice(0, 10) : val
                  }));
                }}
                className="border p-2 w-full rounded pr-32 focus:outline-none"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                required
                readOnly={!editField.phone}
              />
              {!editField.phone && (
                <button
                  type="button"
                  className="absolute text-xs underline text-[#34c3ec] right-0 top-1 z-20 changeBtn"
                  onClick={() => handleChangeField("phone")}
                >Change</button>
              )}
              {editField.phone && !phoneOtpSent && (
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-5 text-white font-bold rounded-r transition bg-[#34c3ec] hover:bg-[#34b2d7]"
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    opacity: isValidPhone(formData.phone) && formData.phone !== original.phone ? 1 : 0.5
                  }}
                  disabled={!isValidPhone(formData.phone) || formData.phone === original.phone}
                  onClick={() => handleSendOtp("phone")}
                >
                  Send OTP
                </button>
              )}
              {editField.phone && phoneOtpSent && (
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-5 text-white font-bold rounded-r transition bg-[#34c3ec] hover:bg-[#34b2d7]"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  onClick={() => handleSendOtp("phone")}
                  disabled={phoneOtpTimer > 0}
                >
                  {phoneOtpTimer > 0
                    ? `${Math.floor(phoneOtpTimer / 60)}:${(phoneOtpTimer % 60).toString().padStart(2, "0")}`
                    : "Resend"}
                </button>
              )}
            </div>
            {phoneOtpSent && (
              <div className="transition-all duration-300 mt-3 relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Enter Phone OTP"
                  value={phoneOtp}
                  onChange={e => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="border p-2 rounded w-full pr-32 focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-5 text-white rounded-r font-semibold transition"
                  style={{
                    background: "rgb(52 195 236)",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                  }}
                  disabled={phoneOtp.length !== 6}
                  onClick={() => handleVerifyOtp("phone")}
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          {/* Email Field with "Change" and OTP */}
          <div className="relative mb-6">
            <label className="block mb-1">Email:</label>
            <div className="relative w-full">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                className="border p-2 w-full rounded pr-32 focus:outline-none"
                required
                readOnly={!editField.email}
              />
              {!editField.email && (
                <button
                  type="button"
                  className="absolute text-xs underline text-[#34c3ec] right-0 top-1 z-20 changeBtn"
                  onClick={() => handleChangeField("email")}
                >Change</button>
              )}
              {editField.email && !emailOtpSent && (
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-5 text-white font-bold rounded-r transition bg-[#34c3ec] hover:bg-[#34b2d7]"
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    opacity: isValidEmail(formData.email) && formData.email !== original.email ? 1 : 0.5
                  }}
                  disabled={!isValidEmail(formData.email) || formData.email === original.email}
                  onClick={() => handleSendOtp("email")}
                >
                  Send OTP
                </button>
              )}
              {editField.email && emailOtpSent && (
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-5 text-white font-bold rounded-r transition bg-[#34c3ec] hover:bg-[#34b2d7]"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  onClick={() => handleSendOtp("email")}
                  disabled={emailOtpTimer > 0}
                >
                  {emailOtpTimer > 0
                    ? `${Math.floor(emailOtpTimer / 60)}:${(emailOtpTimer % 60).toString().padStart(2, "0")}`
                    : "Resend"}
                </button>
              )}
            </div>
            {emailOtpSent && (
              <div className="transition-all duration-300 mt-3 relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Enter Email OTP"
                  value={emailOtp}
                  onChange={e => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="border p-2 rounded w-full pr-32 focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-5 text-white rounded-r font-semibold transition"
                  style={{
                    background: "rgb(52 195 236)",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                  }}
                  disabled={emailOtp.length !== 6}
                  onClick={() => handleVerifyOtp("email")}
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1">College:
              <input
                name="college"
                value={formData.college}
                onChange={e => setFormData(f => ({ ...f, college: e.target.value }))}
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          <div>
            <label className="block mb-1">Department:
              <input
                name="dept"
                value={formData.dept}
                onChange={e => setFormData(f => ({ ...f, dept: e.target.value }))}
                className="border p-2 w-full rounded"
              />
            </label>
          </div>
          {/* <div>
            <label className="block mb-1">Profile Picture:
              <input
                type="file"
                name="profilePic"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setLoading(true);
                      const uploadFormData = new FormData();
                      uploadFormData.append('file', file);
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // No content-type for FormData!
                        body: uploadFormData,
                      });
                      if (response.ok) {
                        const data = await response.json();
                        if (data.url) {
                          setFormData(prev => ({ ...prev, profilePic: data.url }));
                          setSuccess("Profile picture uploaded!");
                        } else {
                          setError("Upload failed: No URL returned.");
                        }
                      } else {
                        setError("Failed to upload file. Try another image.");
                      }
                    } catch (err) {
                      setError("File upload error.");
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                className="border p-2 w-full rounded"
              />
            </label>
          </div> */}

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 max-w-lg">
          <div className="flex items-center space-x-4 mb-6">
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">
                  {formData.name?.[0]}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 OtherDetails">
            <div>
              <p className="font-medium titles">Email</p>
              <p>{formData.email}</p>
              {/* {fieldVer.email ? (
                <span className="text-green-600 text-sm">Verified</span>
              ) : (
                <span className="text-red-600 text-sm">Not verified</span>
              )} */}
            </div>
            <div>
              <p className="font-medium titles">Phone</p>
              <p>{formData.phone}</p>
              {/* {fieldVer.phone ? (
                <span className="text-green-600 text-sm">Verified</span>
              ) : (
                <span className="text-red-600 text-sm">Not verified</span>
              )} */}
            </div>
            <div>
              <p className="font-medium titles">College</p>
              <p>{formData.college}</p>
            </div>
            <div>
              <p className="font-medium titles">Department</p>
              <p>{formData.dept}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
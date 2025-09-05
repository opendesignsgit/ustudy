"use client";

import React, { useState, useEffect, useRef } from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { LoginFormModal } from '@/components/LoginFormModal';
import toast, { Toaster } from 'react-hot-toast';
// import { FaRegClock, FaRupeeSign } from 'react-icons/fa';
// import { useDocumentInfo } from '@payloadcms/ui'

type Props = {
  formTitle: string;
  termslink: string;
  className?: string;
  formClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  loaderClassName?: string;
  successMessageClassName?: string;
  errorMessageClassName?: string;
  pageId?: number; // Add slug prop
};

export const RegisterFormBlock: React.FC<Props> = ({
  formTitle,
  termslink,
  className,
  formClassName,
  inputClassName,
  labelClassName,
  buttonClassName,
  loaderClassName,
  successMessageClassName,
  errorMessageClassName,
  pageId, // Destructure slug
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    dept: '',
    terms: false,
    otp: '',
  });

  const [selectedCountry, setSelectedCountry] = useState('in');
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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coursePrice, setCoursePrice] = useState<number | null>(null);
  const [courseHour, setCourseHour] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [courseID, setCourseID] = useState<string | null>(null);
  const [book, setbook] = useState<string | null>(null);


  // Separate OTP state variables
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');



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

          // Check if the token exists in the response
          if (result.token) {
            setIsLoggedIn(true);
            // Optionally, store the token and user details for later use
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking customer logged in status:', error);
        setIsLoggedIn(false);
      }
    };

    checkCustomerLoggedInStatus();
  }, []);


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/courses/${pageId}`);
        const data = await response.json();
        setCoursePrice(data.courseprice);
        setCourseHour(data.coursehour);
        setCourseName(data.title); // Ensure your API returns courseName
        setCourseID(data.id);     // Ensure your API returns courseID
        setbook(data.book);     // Ensure your API returns courseID
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    if (pageId) {
      fetchCourseData();
    }
  }, [pageId]);

  // console.log(pageId);

  useEffect(() => {
    const phoneVerified = localStorage.getItem('is_phone_verified') === '1';
    const emailVerified = localStorage.getItem('is_email_verified') === '1';
    if (phoneVerified) {
      setIsPhoneVerified(true);
    }
    if (emailVerified) {
      setIsEmailVerified(true);
    }

    // Check if user is logged in using the /api/students/me and /api/students/me endpoints
    // const checkLoggedInStatus = async () => {
    //   try {
    //     const response1 = await fetch('/api/students/me', {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     if (response1.ok) {
    //       const result1 = await response1.json();
    //       console.log(result1);

    //       if (result1.loggedIn) {
    //         setIsLoggedIn(true);
    //         return;
    //       }
    //     }

    //     // const response2 = await fetch('/api/students/me', {
    //     //   method: 'GET',
    //     //   headers: {
    //     //     'Content-Type': 'application/json',
    //     //   },
    //     // });

    //     // if (response2.ok) {
    //     //   const result2 = await response2.json();
    //     //   if (result2.loggedIn) {
    //     //     setIsLoggedIn(true);
    //     //   }
    //     // }

    //     // console.log(response1)
    //     // console.log(response2)
    //   } catch (error) {
    //     console.error('Error checking logged in status:', error);
    //   }
    // };

    // checkLoggedInStatus();
  }, []);

  useEffect(() => {
    // Remove any non-digit characters from the phone
    const phoneDigits = formData.phone.replace(/\D/g, '');
    // For example, for India, a valid number should have 10 digits and start with 6-9
    if (
      selectedCountry === 'in' &&
      phoneDigits.length === 10 &&
      /^[6-9]/.test(phoneDigits)
    ) {
      setShowPhoneOTPButton(true);
    } else {
      setShowPhoneOTPButton(false);
    }
  }, [selectedCountry, formData.phone]);

  useEffect(() => {
    // Clear the phone field when the selected country changes
    setFormData(prev => ({ ...prev, phone: '' }));
  }, [selectedCountry]);

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
    if (countryData.iso2 === 'in') {
      cleanedValue = value.replace(/\D/g, '');
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const startOTPTimer = (duration: number, setOtpTimerCount: React.Dispatch<React.SetStateAction<number>>, otpIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
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

  const stopOTPTimer = (otpIntervalRef: React.RefObject<NodeJS.Timeout | null>, setOtpTimerCount: React.Dispatch<React.SetStateAction<number>>) => {
    if (otpIntervalRef.current) {
      clearInterval(otpIntervalRef.current);
      otpIntervalRef.current = null;
    }
    setOtpTimerCount(0);
  };

  const handleSendPhoneOTP = async () => {
    if (!showPhoneOTPButton) return;
    setErrorMessage('');
    setSuccessMessage('');
    const phone = formData.phone.trim();

    try {
      const response = await fetch(`/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'OTP sent successfully.');
        // Set OTP sent flag only after a successful API response
        setPhoneOtpSent(true);
        startOTPTimer(120, setPhoneOtpTimerCount, phoneOtpIntervalRef);
      } else {
        setErrorMessage(result.message || 'Failed to send OTP.');
        setPhoneOtpSent(false);
      }
    } catch (error: any) {
      setErrorMessage('Error: ' + error.message);
      setPhoneOtpSent(false);
    }
  };


  const handleSendEmailOTP = async () => {
    if (!showEmailOTPButton) return;
    setErrorMessage('');
    setSuccessMessage('');
    const email = formData.email.trim();

    try {
      const response = await fetch(`/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || 'OTP sent successfully.');
        // Set OTP sent flag only after a successful API response
        setEmailOtpSent(true);
        startOTPTimer(120, setEmailOtpTimerCount, emailOtpIntervalRef);
      } else {
        setErrorMessage(result.message || 'Failed to send OTP.');
        setEmailOtpSent(false);
      }
    } catch (error: any) {
      setErrorMessage('Error: ' + error.message);
      setEmailOtpSent(false);
    }
  };


  // Example change handlers for phone and email OTPs
  const handlePhoneOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setPhoneOtp(value);
    }
    if (value.length === 6) {
      checkOTP(value, 'phone');
    }
  };

  const handleEmailOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setEmailOtp(value);
    }
    if (value.length === 6) {
      checkOTP(value, 'email');
    }
  };

  // Updated OTP verification function accepts a medium argument
  const checkOTP = async (otp: string, medium: 'phone' | 'email') => {
    let payload = {};
    if (medium === 'phone') {
      payload = { medium: 'phone', phone: formData.phone.trim(), otp };
    } else if (medium === 'email') {
      payload = { medium: 'email', email: formData.email.trim(), otp };
    }

    try {
      const response = await fetch('/api/check-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.message === 'OTP verified successfully') {
        if (medium === 'phone') {
          clearInterval(phoneOtpIntervalRef.current!);
          setPhoneOtpTimerCount(0);
          setIsPhoneVerified(true);
          localStorage.setItem('is_phone_verified', '1');
        } else if (medium === 'email') {
          clearInterval(emailOtpIntervalRef.current!);
          setEmailOtpTimerCount(0);
          setIsEmailVerified(true);
          localStorage.setItem('is_email_verified', '1');
        }
        // Optionally, display a success message.
        if (medium === 'phone') {
          toast.success('Phone verified successfully!');
        } else {
          toast.success('Email verified successfully!');
        }
      } else {
        // Handle error – show error message and reset verification if necessary.
        toast.error(result.message || 'OTP verification failed');
        if (medium === 'phone') {
          setIsPhoneVerified(false);
          localStorage.setItem('is_phone_verified', '0');
        } else if (medium === 'email') {
          setIsEmailVerified(false);
          localStorage.setItem('is_email_verified', '0');
        }
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error.message);
      toast.error('Error verifying OTP');
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPhoneVerified && selectedCountry === 'in') {
      toast.error('Please verify your phone number before enrolling.');
      setErrorMessage('Please verify your phone number before enrolling.');
      return;
    }
    if (!isEmailVerified) {
      toast.error('Please verify your email before enrolling.');
      setErrorMessage('Please verify your email before enrolling.');
      return;
    }
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const password = generatePassword();
    const username = formData.email;
    const formDataWithPassword = { ...formData, password, username };

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataWithPassword),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('User created successfully');
        setIsLoggedIn(true);

        await fetch('/api/sendWelcomeEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
        if (
          errorData.errors &&
          errorData.errors[0].name === 'ValidationError' &&
          errorData.errors[0].data.errors[0].path === 'email'
        ) {
          setIsLoginModalOpen(true);
        } else {
          setErrorMessage(errorData.error || 'Failed to create user');
        }
      }
    } catch (error: any) {
      setErrorMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        // console.log('Login successful:', json);

        setIsLoginModalOpen(false);
        setSuccessMessage('Login successful');

        // You might want to store the token in localStorage or cookies for future authenticated requests
        localStorage.setItem('token', json.token);

        // Optionally, you can store user details as well
        localStorage.setItem('user', JSON.stringify(json.user));
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Invalid credentials');
      }
    } catch (error: any) {
      setErrorMessage('Error: ' + error.message);
    }
  };
  const handleRazorpaySuccess = async (razorpayResponse: any) => {
    // Build your order payload with courseName and courseID
    const orderPayload = {
      courseName: courseName || 'Default Course Name', // fetched from your course data
      courseID: courseID || 'DefaultCourseID',           // fetched from your course data
      book: book || 'DefaultCourseID',           // fetched from your course data
      customerName: JSON.parse(localStorage.getItem('user') || '{}')?.name || '',
      customerID: JSON.parse(localStorage.getItem('user') || '{}')?.id || '',
      orderDate: new Date().toISOString(),
      razorpayResponse, // the complete response from Razorpay
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('Order created successfully');
        // console.log('Order stored successfully:', result);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create order');
      }
    } catch (error: any) {
      setErrorMessage('Error: ' + error.message);
    }

  };


  const handlePayment = async () => {
    try {
      // Retrieve the stored user details from localStorage.
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      // Create a Razorpay order using your API.
      const res = await fetch('/api/razorpay-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: (coursePrice || 0) * 100, currency: 'INR', receipt: 'order_rcptid_11' }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // use your public key here
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Ktec',
        description: 'Test Transaction',
        order_id: orderData.id, // pass the order id returned by your API
        handler: function (response: any) {
          // console.log('Payment response', response);
          handleRazorpaySuccess(response);
        },
        prefill: {
          // Use the user email and phone if available; fallback to form data otherwise.
          name: user?.name || formData.name,
          email: user?.email || formData.email,
          contact: user?.phone || formData.phone,
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error.message);
    }
  };



  if (isLoggedIn) {
    return (
      <div className={`container mx-auto p-4 sticky top-0 ${className}`}>
        <h2 className="text-lg font-bold mb-8">{formTitle}</h2>
        <div className="flex flex-wrap -mx-3">
          <div className="w-full md:w-1/2 px-3 mb-6">
            <div className="bg-gray-200 p-4 rounded">
              <div className="text-lg font-bold mb-4 titHr">Course Hours</div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6">
            <div className="bg-gray-200 p-4 rounded">
              <div className="text-lg font-bold mb-4 titPrice">Course Price</div>
              <p><div className="flex items-center space-x-2">
                <span className="text-gray-500 line-through text-sm">₹7900</span>
                <span className="text-green-600 font-bold text-xl">₹{coursePrice}</span>
              </div></p>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`w-full bg-[#00a44f] hover:bg-[#00a44f] text-white font-bold py-2 px-4 rounded ${buttonClassName}`}
          onClick={handlePayment}
        >
          Pay and Enroll Now
        </button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-4 sticky top-0 ${className}`}>
      <form onSubmit={handleSubmit} className={`w-full max-w-lg ${formClassName}`}>
        <h2 className="text-lg font-bold mb-8">{formTitle}</h2>

        {/* Name Field */}
        <div className="flex flex-wrap -mx-3">
          <div className="w-full px-3 mb-6">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${labelClassName}`}
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 items-end phoneOut">
          <div className="w-full px-3 mb-6">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${labelClassName}`}
              htmlFor="phone"
            >
              Phone
            </label>
            {/* Show phone input only if OTP is not sent and not verified */}

            {!phoneOtpSent && !isPhoneVerified && (
              <IntlTelInput
                containerClassName="intl-tel-input"
                inputClassName={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
                fieldName="phone"
                value={formData.phone}
                onPhoneNumberChange={handlePhoneNumberChange}
                formatOnInit={true}
                preferredCountries={['in', 'us']}
                autoHideDialCode={true}
                separateDialCode={true}
              />
            )}
            {/* Show OTP field only after OTP is sent successfully and phone is not yet verified */}
            {phoneOtpSent && !isPhoneVerified && (
              <input
                id="phone-otp"
                type="text"
                placeholder="Enter Phone OTP"
                value={phoneOtp}
                onChange={handlePhoneOtpChange}
                maxLength={6}
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
                required
              />
            )}
            {/* Once verified, show the phone in read-only mode */}
            {isPhoneVerified && (
              <input
                type="text"
                value={formData.phone}
                readOnly
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
              />
            )}
          </div>
          {/* OTP Button: Show if OTP is not sent yet */}
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
                    .padStart(2, '0')}:${(phoneOtpTimerCount % 60)
                      .toString()
                      .padStart(2, '0')}`
                  : 'Verify'}
              </button>
            </div>
          )}
        </div>


        {/* --- Email Field Section --- */}
        <div className="flex flex-wrap -mx-3 items-end emailOut">
          <div className="w-full px-3 mb-6">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${labelClassName}`}
              htmlFor="email"
            >
              Email
            </label>
            {/* Show email input only if OTP is not sent and not verified */}
            {!emailOtpSent && !isEmailVerified && (
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
                required
              />
            )}
            {/* Show OTP field only after OTP is sent successfully and email is not yet verified */}
            {emailOtpSent && !isEmailVerified && (
              <input
                id="email-otp"
                type="text"
                placeholder="Enter Email OTP"
                value={emailOtp}
                onChange={handleEmailOtpChange}
                maxLength={6}
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
                required
              />
            )}
            {/* Once verified, show the email in read-only mode */}
            {isEmailVerified && (
              <input
                type="text"
                value={formData.email}
                readOnly
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
              />
            )}
          </div>
          {/* OTP Button: Show if OTP is not sent yet */}
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
                    .padStart(2, '0')}:${(emailOtpTimerCount % 60)
                      .toString()
                      .padStart(2, '0')}`
                  : 'Verify'}
              </button>
            </div>
          )}
        </div>

        {/* Other Fields (College, Department, Terms) */}
        <div className="flex flex-wrap -mx-3">
          <div className="w-full px-3 mb-6">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${labelClassName}`}
              htmlFor="college"
            >
              College
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
              id="college"
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3">
          <div className="w-full px-3 mb-6">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 ${labelClassName}`}
              htmlFor="dept"
            >
              Department
            </label>
            <input
              className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${inputClassName}`}
              id="dept"
              type="text"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              required
            />
          </div>
        </div>
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
            className={`ml-2 block uppercase tracking-wide text-gray-700 text-xs font-bold ${labelClassName}`}
            htmlFor="terms"
          >
            By enrolling this course, you agree to our{" "}
            <a href={termslink}>Terms & conditions and Privacy</a> Notice.
          </label>
        </div>


        {/* Enroll Now Button (disabled until verified) */}
        <button
          type="submit"
          className={`w-full bg-[#00a44f] hover:bg-[#00a44f] text-white font-bold py-2 px-4 rounded ${buttonClassName}`}
          disabled={loading || (!isPhoneVerified && selectedCountry === 'in') || !isEmailVerified}
        >
          Enroll Now
        </button>
        {loading && <div className={`text-center ${loaderClassName}`}>Loading...</div>}
        {successMessage && <div className={`text-center text-green-500 ${successMessageClassName}`}>{successMessage}</div>}
        {errorMessage && <div className={`text-center text-red-500 ${errorMessageClassName}`}>{errorMessage}</div>}
      </form>
      <LoginFormModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        email={formData.email}
      />
      <Toaster position="top-right" />
    </div>
  );
};

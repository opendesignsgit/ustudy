// PaymentFlow.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { CoursePriceDisplay } from './CoursePriceDisplay';
import { RazorpayScriptLoader } from './RazorpayScriptLoader';

declare global {
    interface Window {
        Razorpay: any;
    }
}

type PaymentFlowProps = {
    userData: any;
    pageId?: number;
    onComplete: () => void;
};

export const PaymentFlow = ({ userData, pageId, onComplete }: PaymentFlowProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [course, setCourse] = useState<any>(null);
    const [conversionRate, setConversionRate] = useState(1);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!pageId) return;
            try {
                const response = await fetch(`/api/courses/${pageId}`);
                const data = await response.json();

                const rate = data.university?.country?.currencyValue || 1;
                setConversionRate(rate);

                setCourse({
                    ...data,
                    price: data.fees?.reduce((sum: number, fee: any) => sum + fee.feeAmount, 0) || 0,
                    name: data.title,
                    id: data.id,
                });
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };
        fetchCourseData();
    }, [pageId]);
    // console.log(course);

    const handlePayment = async () => {
        if (!course) return;

        setIsProcessing(true);

        try {
            const totalMYR = course.price;
            const totalINR = Math.round(totalMYR * conversionRate);

            const orderResponse = await fetch('/api/razorpay-init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalINR * 100, // Convert to paise
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderResponse.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Ustudy Global',
                description: `Payment for ${course.name}`,
                order_id: orderData.id,
                handler: async (response: any) => {
                    try {
                        // Save booking to database
                        const bookingResponse = await fetch('/api/bookings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                course: course.id,
                                student: userData.id,
                                orderDate: new Date().toISOString(),
                                originalAmount: totalMYR,
                                convertedAmount: totalINR,
                                currencyRate: conversionRate,
                                razorpayResponse: JSON.stringify(response),
                            }),
                        });

                        if (bookingResponse.ok) {
                            setPaymentSuccess(true);
                            // Send booking confirmation emails
                            await fetch('/api/send-booking-confirmation', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: userData.email,
                                    name: userData.name,
                                    courseName: course.name,
                                    universityName: course.university?.title || '', // Add university name
                                    amountPaid: totalINR,
                                    currency: 'INR',
                                    bookingDate: new Date().toLocaleDateString(),
                                }),
                            });
                            setTimeout(onComplete, 5000); // Auto-close after 3 seconds
                        }

                        onComplete();
                    } catch (error) {
                        console.error('Error storing order:', error);
                    }
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: userData.phone,
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <RazorpayScriptLoader>
            <div>
                {paymentSuccess ? (
                    <div className="text-center p-6">
                        <div className="text-green-500 text-2xl mb-2">✓</div>
                        <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
                        <p className="text-gray-600">Your enrollment for {course?.name} has been confirmed.</p>
                        <p className="text-gray-600 mt-2">A confirmation email has been sent to {userData?.email}.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium mb-4">Complete Your Enrollment</h3>
                        <CoursePriceDisplay pageId={pageId} />
                        <div className="mt-6">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !course}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Pay and Enroll Now'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </RazorpayScriptLoader>
    );
};
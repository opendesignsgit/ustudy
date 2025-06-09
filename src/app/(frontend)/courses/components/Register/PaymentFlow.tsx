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
    const [course, setCourse] = useState({
        price: null,
        name: null,
        id: null,
        book: null,
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!pageId) return;
            try {
                const response = await fetch(`/api/courses/${pageId}`);
                const data = await response.json();
                setCourse({
                    price: data.courseprice,
                    name: data.title,
                    id: data.id,
                    book: data.book,
                });
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };
        fetchCourseData();
    }, [pageId]);

    const handlePayment = async () => {
        setIsProcessing(true);

        try {
            // 1. Create Razorpay order
            const orderResponse = await fetch('/api/razorpay-init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: (course.price || 0) * 100,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }

            const orderData = await orderResponse.json();

            // 2. Initialize Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Your Company Name',
                description: `Payment for ${course.name}`,
                order_id: orderData.id,
                handler: async (response: any) => {
                    try {
                        // 3. Verify payment and store order
                        await fetch('/api/store-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                courseName: course.name,
                                courseID: course.id,
                                book: course.book,
                                customerName: userData.name,
                                customerID: userData.id,
                                razorpayResponse: response,
                            }),
                        });
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
                <h3 className="text-lg font-medium mb-4">Complete Your Enrollment</h3>

                <CoursePriceDisplay pageId={pageId} />

                <div className="mt-6">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : 'Pay and Enroll Now'}
                    </button>
                </div>
            </div>
        </RazorpayScriptLoader>
    );
};
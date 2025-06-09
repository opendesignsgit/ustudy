// RegisterFlow.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FloatingEnrollButton } from './FloatingEnrollButton';
import { RegisterFormModal } from './RegisterFormModal';
import { useAuth } from '@/providers/Auth';
import { useRouter } from 'next/navigation';

export const RegisterFlow = ({ pageId }: { pageId?: number }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { user } = useAuth();
    const [isEnrolled, setIsEnrolled] = useState(true);
    const [hasCourseFee, setHasCourseFee] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkEnrollmentAndCourseFee = async () => {
            if (user?.id && pageId) {
                try {
                    // Check enrollment status
                    const res = await fetch(`/api/bookings?where[student][equals]=${user.id}&where[course][equals]=${pageId}`);
                    const data = await res.json();
                    setIsEnrolled(data.docs && data.docs.length > 0);

                    // Check if course has fees
                    const courseRes = await fetch(`/api/courses/${pageId}`);
                    const courseData = await courseRes.json();
                    const totalFee = courseData.fees?.reduce((sum: number, fee: any) => sum + fee.feeAmount, 0) || 0;
                    setHasCourseFee(totalFee > 0);
                } catch (error) {
                    setIsEnrolled(false);
                    setHasCourseFee(true); // Default to true if there's an error
                    console.error('Error checking enrollment or course fee:', error);
                }
            } else if (pageId) {
                // Only check course fee if not logged in
                try {
                    const courseRes = await fetch(`/api/courses/${pageId}`);
                    const courseData = await courseRes.json();
                    const totalFee = courseData.fees?.reduce((sum: number, fee: any) => sum + fee.feeAmount, 0) || 0;
                    setHasCourseFee(totalFee > 0);
                } catch (error) {
                    setHasCourseFee(true); // Default to true if there's an error
                    console.error('Error checking course fee:', error);
                }
            }
        };
        checkEnrollmentAndCourseFee();
    }, [user, pageId]);

    const handleToggleToLogin = () => {
        setIsFormOpen(false);
    };

    const handlePaymentComplete = () => {
        setIsEnrolled(true); // Hide the button
        setIsFormOpen(false); // Close the modal
    };

    const handleButtonClick = () => {
        if (hasCourseFee) {
            setIsFormOpen(true);
        } else {
            router.push('/contact-us#contformSec');
        }
    };

    return (
        <>
            <FloatingEnrollButton
                onClick={handleButtonClick}
                text={hasCourseFee ? "Enroll Now" : "Enquire Now"}
            />

            {hasCourseFee && (
                <RegisterFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    pageId={pageId}
                    user={user}
                    onToggleToLogin={handleToggleToLogin}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}
        </>
    );
};
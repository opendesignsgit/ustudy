// CoursePriceDisplay.tsx
"use client";

import React, { useState, useEffect } from 'react';

export const CoursePriceDisplay = ({ pageId }: { pageId?: number }) => {
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [conversionRate, setConversionRate] = useState(1);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!pageId) return;
            // console.log(pageId)
            try {
                setLoading(true);
                const response = await fetch(`/api/courses/${pageId}`);
                const data = await response.json();

                // Get conversion rate from country data
                const rate = data.university?.country?.currencyValue || 1;
                setConversionRate(rate);
                // console.log(data);

                setCourse(data);
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [pageId]);

    if (loading || !course) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    // Calculate totals
    const totalMYR = course.fees?.reduce((sum: number, fee: any) => sum + fee.feeAmount, 0) || 0;
    const totalINR = Math.round(totalMYR * conversionRate);

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4 text-lg">{course.title}</h4>

            <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Fees Structure</h5>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Name</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (MYR)</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {course.fees?.map((fee: any) => (
                                <tr key={fee.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fee.feeName}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{fee.feeAmount.toLocaleString()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {Math.round(fee.feeAmount * conversionRate).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-medium">
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">Total</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{totalMYR.toLocaleString()}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{totalINR.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                    Conversion rate: 1 MYR = {conversionRate} INR
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500 line-through text-sm">₹{Math.round(totalINR * 1.2).toLocaleString()}</span>
                    <span className="text-green-600 font-bold text-lg">₹{totalINR.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
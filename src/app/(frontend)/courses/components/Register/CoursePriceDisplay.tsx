// CoursePriceDisplay.tsx
"use client";

import React, { useState, useEffect } from 'react';

export const CoursePriceDisplay = ({ pageId }: { pageId?: number }) => {
    const [course, setCourse] = useState({
        price: null,
        hour: null,
        name: null,
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!pageId) return;

            try {
                const response = await fetch(`/api/courses/${pageId}`);
                const data = await response.json();
                setCourse({
                    price: data.courseprice,
                    hour: data.coursehour,
                    name: data.title,
                });
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchCourseData();
    }, [pageId]);

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{course.name}</h4>
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-gray-500">Duration: </span>
                    <span className="font-medium">{course.hour} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500 line-through text-sm">₹7900</span>
                    <span className="text-green-600 font-bold text-lg">₹{course.price}</span>
                </div>
            </div>
        </div>
    );
};
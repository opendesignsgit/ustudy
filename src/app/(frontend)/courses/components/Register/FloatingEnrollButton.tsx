// FloatingEnrollButton.tsx
"use client";

import React from 'react';

type FloatingEnrollButtonProps = {
    onClick: () => void;
    text: string;
};

export const FloatingEnrollButton = ({ onClick, text }: FloatingEnrollButtonProps) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 enrollbtn">
            <button
                onClick={onClick}
                className="bg-[#1f9714] hover:bg-[#ffffff] text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                {text}
            </button>
        </div>
    );
};
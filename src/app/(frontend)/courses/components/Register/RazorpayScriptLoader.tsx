"use client";

import { useEffect, useState } from 'react';

export const RazorpayScriptLoader = ({ children }: { children: React.ReactNode }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    return <>{children}</>;
};
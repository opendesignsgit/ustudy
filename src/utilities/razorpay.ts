// lib/razorpay.ts

import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface OrderOptions {
    amount: number; // amount in smallest currency unit (e.g., paise)
    currency?: string; // default 'INR'
    receipt?: string;
    payment_capture?: number; // 1 for automatic capture
}

/**
 * Creates a Razorpay order using the provided options.
 */
export const createOrder = async ({
    amount,
    currency = 'INR',
    receipt = 'receipt#1',
    payment_capture = 1,
}: OrderOptions) => {
    const options = {
        amount,
        currency,
        receipt,
        payment_capture,
    };

    return razorpayInstance.orders.create(options);
};

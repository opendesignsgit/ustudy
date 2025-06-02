// pages/api/razorpay-init.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from '@/utilities/razorpay';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { currency, receipt } = req.body;
        const amount = 100
        // Ensure that the amount is provided (and other validations if needed)
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const order = await createOrder({ amount, currency, receipt });
        res.status(200).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

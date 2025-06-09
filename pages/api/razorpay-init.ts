// pages/api/razorpay-init.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const options = {
      amount: amount.toString(), // Amount should be in paise (e.g., 100 INR = 10000 paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create order' 
    });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOTPEmail } from '@/utilities/sendOTPEmail';
import { sendOTPPhone } from '@/utilities/sendOTPPhone';
import { generateAndStoreOTP } from '@/utilities/fileStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const ttl = 5 * 60 * 1000; // 5 minutes

  try {
    if (email) {
      await sendOTPEmail(email, otp);
      generateAndStoreOTP(email, otp, ttl);
    }

    if (phone) {
      await sendOTPPhone(phone, otp);
      generateAndStoreOTP(phone, otp, ttl);
    }

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    return res.status(500).json({ 
      message: 'Failed to send OTP', 
      error: error.message 
    });
  }
}
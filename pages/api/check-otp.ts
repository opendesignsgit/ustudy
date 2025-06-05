import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyOTP } from '@/utilities/fileStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { medium, phone, email, otp } = req.body;

  if (!medium || !otp) {
    return res.status(400).json({ message: 'Invalid request parameters' });
  }

  const key = medium === 'phone' ? phone : email;

  if (!key) {
    return res.status(400).json({ message: 'Phone or Email is required' });
  }

  try {
    const isValid = verifyOTP(key, otp);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    return res.status(500).json({ 
      message: 'Error verifying OTP', 
      error: error.message 
    });
  }
}
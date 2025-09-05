import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOTPEmail } from '@/utilities/sendOTPEmail';
import { sendOTPPhone } from '@/utilities/sendOTPPhone';
import { generateAndStoreOTP } from '@/utilities/fileStore';

// Simple internal security token - in production this should be a more secure implementation
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'ustudy-internal-2024';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phone } = req.body;
  const authHeader = req.headers.authorization;

  // Check for internal API token
  const token = authHeader?.split(' ')[1] || req.headers['x-internal-token'] as string;
  
  // For frontend requests, we'll use a simple referer check + user agent validation
  const referer = req.headers.referer;
  const userAgent = req.headers['user-agent'];
  
  const isValidFrontendRequest = referer && referer.includes(req.headers.host || '') && userAgent && !userAgent.includes('Postman');
  const isValidInternalRequest = token === INTERNAL_API_TOKEN;
  
  if (!isValidFrontendRequest && !isValidInternalRequest) {
    return res.status(403).json({ message: 'Unauthorized access. This API is for internal use only.' });
  }

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
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOTPEmail } from '@/utilities/sendOTPEmail';
import { sendOTPPhone } from '@/utilities/sendOTPPhone';
import { generateAndStoreOTP } from '@/utilities/fileStore';

// Simple rate limiting store
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_ATTEMPTS = 3; // 3 attempts per minute

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phone } = req.body;
  
  // Simple rate limiting based on IP address
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const rateLimitKey = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  
  const rateLimitData = rateLimitStore.get(rateLimitKey);
  if (rateLimitData) {
    if (now - rateLimitData.lastReset > RATE_LIMIT_WINDOW) {
      // Reset the rate limit window
      rateLimitStore.set(rateLimitKey, { count: 1, lastReset: now });
    } else if (rateLimitData.count >= RATE_LIMIT_MAX_ATTEMPTS) {
      return res.status(429).json({ 
        message: 'Too many OTP requests. Please try again later.' 
      });
    } else {
      rateLimitData.count++;
    }
  } else {
    rateLimitStore.set(rateLimitKey, { count: 1, lastReset: now });
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
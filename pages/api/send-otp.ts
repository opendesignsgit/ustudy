import type { NextApiRequest, NextApiResponse } from 'next';
import { sendOTPEmail } from '@/utilities/sendOTPEmail';
import { sendOTPPhone } from '@/utilities/sendOTPPhone';
import { generateAndStoreOTP } from '@/utilities/fileStore';

// Simple rate limiting storage (in production, use Redis or similar)
const rateLimitStore: { [key: string]: { count: number; resetTime: number } } = {};
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore[identifier];
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore[identifier] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  entry.count++;
  return true;
};

// Internal security token - in production this should be from environment variables
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'internal-api-secret-2024';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check for internal API token to prevent external misuse
  const authHeader = req.headers.authorization;
  const providedToken = authHeader?.replace('Bearer ', '');
  
  if (!providedToken || providedToken !== INTERNAL_API_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }

  // Basic validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (phone && !/^[6-9][0-9]{9}$/.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  // Rate limiting
  const identifier = email || phone;
  if (!checkRateLimit(identifier)) {
    return res.status(429).json({ 
      message: 'Too many OTP requests. Please try again after 15 minutes.' 
    });
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
// pages/api/send-booking-confirmation.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendBookingConfirmation } from '@/utilities/sendWelcomeEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, courseName, universityName, amountPaid, currency, bookingDate } = req.body;

  if (!email || !name || !courseName || !amountPaid) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    await sendBookingConfirmation({
      email,
      name,
      courseName,
      universityName,
      amountPaid,
      currency,
      bookingDate
    });
    return res.status(200).json({ message: 'Booking confirmation emails sent successfully' });
  } catch (error: any) {
    return res.status(500).json({ 
      message: 'Failed to send booking confirmation', 
      error: error.message 
    });
  }
}
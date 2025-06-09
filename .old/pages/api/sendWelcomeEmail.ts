import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWelcomeEmail } from '@/utilities/sendWelcomeEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, phone, college, dept, username, password } = req.body;

  if (!email || !name || !phone || !college || !dept || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await sendWelcomeEmail({ email, name, phone, college, dept, username, password });
    return res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error: any) {
    return res.status(500).json({ 
      message: 'Failed to send welcome email', 
      error: error.message 
    });
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactFormEmail, validateContactForm, ContactFormFields } from '@/utilities/contactFormEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, location, message } = req.body as ContactFormFields;
  const fields = { name, email, phone, location, message };

  const errors = validateContactForm(fields);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    await sendContactFormEmail({ fields });
    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Failed to send the message',
      error: error.message
    });
  }
}
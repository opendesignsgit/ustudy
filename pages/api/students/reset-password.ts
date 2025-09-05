import type { NextApiRequest, NextApiResponse } from 'next';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phone, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (!email && !phone) {
    return res.status(400).json({ message: 'Email or phone is required' });
  }

  try {
    const payload = await getPayload({ config: configPromise });

    // Find the student by email or phone
    const studentQuery: any = { where: {} };
    if (email) {
      studentQuery.where.email = { equals: email };
    } else if (phone) {
      studentQuery.where.phone = { equals: phone };
    }

    const students = await payload.find({
      collection: 'students',
      ...studentQuery,
    });

    if (!students.docs || students.docs.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = students.docs[0];

    // Update the student's password
    await payload.update({
      collection: 'students',
      id: student.id,
      data: { password },
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      message: 'Failed to reset password', 
      error: error.message 
    });
  }
}
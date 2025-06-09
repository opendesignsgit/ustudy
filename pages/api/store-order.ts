import type { NextApiRequest, NextApiResponse } from 'next';
import payload from 'payload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      courseName,
      courseID,
      book,
      customerName,
      customerID,
      razorpayResponse,
    } = req.body;

    const order = await payload.create({
      collection: 'bookings',
      data: {
        courseName,
        courseID,
        book,
        customerName,
        customerID,
        orderDate: new Date().toISOString(),
        razorpayResponse: JSON.stringify(razorpayResponse),
      },
    });

    res.status(200).json({ order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to store order' 
    });
  }
}
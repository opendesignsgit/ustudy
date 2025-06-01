// /src/api/store-order.js

import payload from 'payload';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const {
            courseName,
            courseID, // optional: you can pass this if available
            customerName,
            customerID, // optional: if you have a customer id from your user records
            razorpayResponse,
        } = req.body;

        // Set the order date to now and define an order status (e.g. 'completed' after successful payment)
        const orderDate = new Date().toISOString();
        const status = 'completed';

        // Create the order document in the orders collection
        const order = await payload.create({
            collection: 'orders',
            data: {
                courseName,
                courseID,
                customerName,
                customerID,
                orderDate,
                status,
                // You may want to store the full response as a JSON string
                razorpayResponse: JSON.stringify(razorpayResponse),
            },
        });

        res.status(200).json({ order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to store order' });
    }
}

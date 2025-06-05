import { NextApiRequest, NextApiResponse } from 'next'
import payload from 'payload'
import type { PayloadRequest } from 'payload'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const { email, password } = req.body

        // Cast req to Partial<PayloadRequest> for compatibility
        const result = await payload.login({
            collection: 'students',
            data: { email, password },
            req: req as unknown as Partial<PayloadRequest>,
        })

        return res.status(200).json({ user: result.user })
    } catch (error) {
        return res.status(400).json({ error: 'Login failed' })
    }
}
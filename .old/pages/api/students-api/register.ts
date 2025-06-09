import { NextApiRequest, NextApiResponse } from 'next'
import payload from 'payload'
import type { PayloadRequest } from 'payload'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const userData = req.body

        const result = await payload.create({
            collection: 'students',
            data: userData,
        })

        // Log the user in after registration
        const { email, password } = userData
        const loginResult = await payload.login({
            collection: 'students',
            data: { email, password },
            req: req as unknown as Partial<PayloadRequest>,
        })

        return res.status(200).json({ user: loginResult.user })
    } catch (error) {
        console.error('Registration error:', error)
        return res.status(400).json({ error: error instanceof Error ? error.message : String(error) })
    }
}
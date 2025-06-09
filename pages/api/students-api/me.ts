import { NextApiRequest, NextApiResponse } from 'next'
import payload from 'payload'

// Helper to extract user from JWT (implement according to your auth strategy)
async function getUserIdFromRequest(req: NextApiRequest): Promise<string | null> {
    // Example: if JWT is stored in a cookie "payload-token"
    const token = req.cookies['payload-token']
    if (!token) return null

    // You should verify and decode the JWT here.
    // For demonstration, use payload.verifyEmailToken or JWT decode here.
    try {
        const user = await payload.verifyJWT(token)
        return user?.id
    } catch {
        return null
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const userId = await getUserIdFromRequest(req)
        if (!userId) {
            return res.status(401).json({ user: null })
        }

        const user = await payload.find({
            collection: 'students',
            where: {
                id: { equals: userId }
            },
            limit: 1,
            depth: 0
        })

        if (user.docs.length === 0) {
            return res.status(404).json({ user: null })
        }

        return res.status(200).json({ user: user.docs[0] })
    } catch (error) {
        return res.status(400).json({ user: null })
    }
}
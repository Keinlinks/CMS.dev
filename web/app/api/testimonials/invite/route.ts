import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { emails, organizationId, categoryId } = body


        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: 'No emails provided' }, { status: 400 })
        }

        if (!organizationId) {
            return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        // Forward request to backend
        const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://cms-dev-1ft6.onrender.com'}/testimonials/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                emails,
                organizationId
            }),
        })

        if (!apiRes.ok) {
            const errorText = await apiRes.text()
            console.error('Backend API error:', errorText)
            return NextResponse.json({ error: 'Failed to send invites via backend' }, { status: apiRes.status })
        }

        const data = await apiRes.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error sending invites:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

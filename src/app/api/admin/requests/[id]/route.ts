import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
    status: z.enum(['NEW', 'REVIEWING', 'CONTACTED', 'CONVERTED', 'CLOSED']),
    notes: z.string().optional(),
})

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body   = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }

    try {
        const updated = await prisma.verificationRequest.update({
            where: { id: params.id },
            data:  { status: parsed.data.status },
        })
        return NextResponse.json({ success: true, request: updated })
    } catch {
        return NextResponse.json({ error: 'Update failed.' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        await prisma.verificationRequest.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Delete failed.' }, { status: 500 })
    }
}
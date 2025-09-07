import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gigs = await prisma.gig.findMany({
      where: { bandId: session.user.id },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(gigs)
  } catch (error) {
    console.error('Error fetching gigs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, date, location, latitude, longitude, pricePerHour, contactPhone, notes } = body

    if (!title || !date || !location || !pricePerHour || !contactPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const gig = await prisma.gig.create({
      data: {
        title,
        date: new Date(date),
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        pricePerHour: parseFloat(pricePerHour),
        contactPhone,
        notes: notes || null,
        bandId: session.user.id
      }
    })

    return NextResponse.json(gig, { status: 201 })
  } catch (error) {
    console.error('Error creating gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
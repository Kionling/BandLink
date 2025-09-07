import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gig = await prisma.gig.findFirst({
      where: { 
        id: params.id,
        bandId: session.user.id 
      }
    })

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    return NextResponse.json(gig)
  } catch (error) {
    console.error('Error fetching gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, date, location, latitude, longitude, pricePerHour, contactPhone, notes } = body

    const existingGig = await prisma.gig.findFirst({
      where: { 
        id: params.id,
        bandId: session.user.id 
      }
    })

    if (!existingGig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    const gig = await prisma.gig.update({
      where: { id: params.id },
      data: {
        title: title || existingGig.title,
        date: date ? new Date(date) : existingGig.date,
        location: location || existingGig.location,
        latitude: latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : existingGig.latitude,
        longitude: longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : existingGig.longitude,
        pricePerHour: pricePerHour ? parseFloat(pricePerHour) : existingGig.pricePerHour,
        contactPhone: contactPhone || existingGig.contactPhone,
        notes: notes !== undefined ? notes : existingGig.notes
      }
    })

    return NextResponse.json(gig)
  } catch (error) {
    console.error('Error updating gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingGig = await prisma.gig.findFirst({
      where: { 
        id: params.id,
        bandId: session.user.id 
      }
    })

    if (!existingGig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 })
    }

    await prisma.gig.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Gig deleted successfully' })
  } catch (error) {
    console.error('Error deleting gig:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
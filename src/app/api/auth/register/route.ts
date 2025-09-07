import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingBand = await prisma.band.findUnique({
      where: { email }
    })

    if (existingBand) {
      return NextResponse.json({ error: 'Band already exists with this email' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const band = await prisma.band.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ 
      message: 'Band created successfully',
      band: {
        id: band.id,
        name: band.name,
        email: band.email
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating band:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
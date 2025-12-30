import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'No QR code provided' }, { status: 400 });
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'dev-secret';
    let decoded: { email: string };
    
    try {
      decoded = jwt.verify(token, secret) as { email: string };
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Invalid QR code' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.party31User.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (!user.paymentStatus) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment not completed',
        user: { name: user.name, email: user.email, passType: user.passType, quantity: user.quantity }
      }, { status: 400 });
    }

    // Check if already checked in
    if (user.checkedIn) {
      return NextResponse.json({ 
        success: true, 
        alreadyCheckedIn: true,
        user: { name: user.name, email: user.email, passType: user.passType, quantity: user.quantity, checkedIn: true }
      });
    }

    // Mark as checked in
    await prisma.party31User.update({
      where: { email: decoded.email },
      data: { checkedIn: true },
    });

    return NextResponse.json({ 
      success: true, 
      alreadyCheckedIn: false,
      user: { name: user.name, email: user.email, passType: user.passType, quantity: user.quantity, checkedIn: true }
    });

  } catch (error) {
    console.error('Error checking in:', error);
    return NextResponse.json({ success: false, error: 'Check-in failed' }, { status: 500 });
  }
}

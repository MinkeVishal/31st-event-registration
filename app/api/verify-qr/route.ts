import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

interface JwtPayload {
  email: string
}

export async function POST(req: Request) {
  const { qrCodeData } = await req.json();

  try {
    const decode = jwt.verify(qrCodeData, `${process.env.JWT_SECRET}`) as JwtPayload
    const email = decode.email
    console.log(email)
    
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found or invalid QR code' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('Error during QR code validation:', error);
    return NextResponse.json({ success: false, error: 'QR code validation failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { email } = await req.json();

  try {
    const newUser = await prisma.user.update({
      where: { email },
      data: { checkedIn: true },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error Updting:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.party31User.findUnique({
      where: { email },
      select: { qrCode: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      qrCode: user.qrCode,
      name: user.name,
    });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch QR code' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, phone, gender, age, quantity, passType, transactionId, referral } = await req.json();

    if (!email || !name || !phone || !gender || !age) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.party31User.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already registered with this email' }, { status: 400 });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ email }, secret, { expiresIn: '60d' });

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(token);

    // Create user(s) based on quantity
    const users = [];
    for (let i = 0; i < (quantity || 1); i++) {
      const user = await prisma.party31User.create({
        data: {
          name: quantity > 1 ? `${name} (${i + 1})` : name,
          email: quantity > 1 ? `${email.split('@')[0]}+${i + 1}@${email.split('@')[1]}` : email,
          phone: quantity > 1 ? `${phone}-${i + 1}` : phone,
          gender,
          age: parseInt(age),
          passType: passType || 'stag',
          quantity: quantity || 1,
          token,
          qrCode: qrCodeData,
          transactionID: transactionId || null,
          screenshot: '',
          paymentStatus: false,
          referral: referral || '',
        },
      });
      users.push(user);
    }

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}

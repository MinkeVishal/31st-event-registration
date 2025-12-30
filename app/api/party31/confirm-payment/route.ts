import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, transactionId } = await req.json();

    if (!email || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if transaction ID already used
    const existingTransaction = await prisma.party31User.findFirst({
      where: { transactionID: transactionId },
    });

    if (existingTransaction) {
      return NextResponse.json({ error: 'This Transaction ID has already been used' }, { status: 400 });
    }

    // Find user and update payment status
    const user = await prisma.party31User.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found. Please register first.' }, { status: 404 });
    }

    // Update user with transaction ID and payment status
    const updatedUser = await prisma.party31User.update({
      where: { email },
      data: {
        transactionID: transactionId,
        paymentStatus: true,
      },
    });

    // Send confirmation email (if configured)
    const isBrevoConfigured = Boolean(
      process.env.BREVO_API_KEY &&
      !`${process.env.BREVO_API_KEY}`.includes('placeholder')
    );

    if (isBrevoConfigured) {
      await sendConfirmationEmail(email, updatedUser.name, updatedUser.qrCode);
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ success: false, error: 'Payment confirmation failed' }, { status: 500 });
  }
}

const sendConfirmationEmail = async (email: string, name: string, qrCodeImageUrl: string) => {
  const emailContent = `
  <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Thank you for registering, ${name}!</h1>
      <p style="color: #666; font-size: 16px;">Your payment has been received. Here is your QR code for entry:</p>
      <div style="margin: 30px 0; text-align: center;">
        <img src="${qrCodeImageUrl}" alt="QR Code" style="max-width: 300px; border-radius: 8px;" />
      </div>
      <h2 style="color: #333;">See you on 31st night! 🎆</h2>
      <p style="color: #999; font-size: 12px;">Please bring this QR code or a screenshot to the event for quick check-in.</p>
    </body>
  </html>`;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'api-key': process.env.BREVO_API_KEY || '',
  });

  const body = JSON.stringify({
    sender: { name: 'Event Organizer', email: 'noreply@party31.com' },
    to: [{ email }],
    subject: '31st Night Party - Payment Confirmed! Your QR Code Inside',
    htmlContent: emailContent,
  });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

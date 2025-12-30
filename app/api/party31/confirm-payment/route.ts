import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, transactionId, screenshot, referral } = await req.json();

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

    // Update user with transaction ID, screenshot, referral and payment status
    const updatedUser = await prisma.party31User.update({
      where: { email },
      data: {
        transactionID: transactionId,
        screenshot: screenshot || '',
        referral: referral || '',
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
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎆 THE GRAND FINALE 🎆</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Year-End 2K25 Party</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Hey ${name}! 🎉</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Your payment has been confirmed! You're all set to join us for the most electrifying night in Chhatrapati Sambhajinagar.
        </p>
        
        <div style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin: 25px 0; text-align: center;">
          <p style="color: #666; margin: 0 0 15px 0; font-weight: 600;">YOUR ENTRY QR CODE</p>
          <img src="${qrCodeImageUrl}" alt="QR Code" style="max-width: 200px; border-radius: 10px; border: 3px solid #667eea;" />
          <p style="color: #999; font-size: 12px; margin-top: 15px;">Screenshot this QR code for quick check-in at the venue</p>
        </div>
        
        <div style="border-left: 4px solid #667eea; padding-left: 15px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #333;"><strong>📅 Date:</strong> Wednesday, Dec 31, 2025</p>
          <p style="margin: 5px 0; color: #333;"><strong>⏰ Time:</strong> 6:30 PM – 12:30 AM</p>
          <p style="margin: 5px 0; color: #333;"><strong>📍 Venue:</strong> Aditya by Meraki, Beed Bypass Road</p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Get ready to say goodbye to 2024 and welcome 2025 with music, dance, and unforgettable memories!
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #333; font-size: 18px; font-weight: 600;">See you there! 🥳</p>
        </div>
      </div>
      
      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
        © 2025 Trip Goals | 31st Night Party
      </p>
    </body>
  </html>`;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'api-key': process.env.BREVO_API_KEY || '',
  });

  const body = JSON.stringify({
    sender: { name: 'Trip Goals - Party31', email: process.env.SENDER_EMAIL || 'noreply@tripgoals.com' },
    to: [{ email, name }],
    subject: '🎉 Your 31st Night Party Pass is Confirmed!',
    htmlContent: emailContent,
  });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email API error:', errorData);
      throw new Error('Failed to send email');
    }

    console.log('Confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

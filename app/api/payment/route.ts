import { NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

// Helper function to calculate X-Verify
const calculateXVerify = (payload: object, saltKey: string, saltIndex: string): string => {
  // Step 1: Base64 encode the payload
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');

  // Step 2: Concatenate Base64 payload + API endpoint + Salt Key
  const stringToHash = `${payloadBase64}/pg/v1/pay${saltKey}`;

  // Step 3: Generate SHA256 hash
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');

  // Step 4: Append salt index
  const xVerify = `${hash}###${saltIndex}`;

  return xVerify;
};

export async function POST(request: Request) {
  const { amount, merchantId, merchantTransactionId, merchantUserId, mobileNumber } = await request.json();

  // Payment payload
  const payload = {
    merchantId,
    merchantTransactionId,
    merchantUserId,
    amount,
    redirectUrl: 'https://your-redirect-url.com',
    redirectMode: 'REDIRECT',
    callbackUrl: 'https://your-callback-url.com',
    mobileNumber,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  // Salt key and index (these will be provided by PhonePe)
  const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Example
  const saltIndex = '1'; // Example

  // Calculate X-Verify checksum
  const xVerify = calculateXVerify(payload, saltKey, saltIndex);

  try {
    const response = await axios.post(
      'https://api.phonepe.com/pg/v1/pay',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
        },
      }
    );

    // Handle response and return data
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error while processing payment:', error);
    return NextResponse.json({ success: false, message: 'Payment failed', error });
  }
}

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';

export default function PaymentScreen() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState(599);
  const [passType, setPassType] = useState('stag');
  
  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.totalAmount) {
        setAmount(user.totalAmount);
      }
      if (user.passType) {
        setPassType(user.passType);
      }
    }
  }, []);

  // Admin UPI details - UPDATE THESE
  const adminUpiId = 'shoaib901198pathan@ybl';
  const adminName = 'Admin Name';
  const transactionNote = 'Party31 Registration';

  // Generate UPI payment URL for mobile button
  const upiUrl = `upi://pay?pa=${adminUpiId}&pn=${encodeURIComponent(adminName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  const handlePayWithAnyUPI = () => {
    window.location.href = upiUrl;
  };

  const handleConfirmPayment = async () => {
    if (!transactionId.trim()) {
      alert('Please enter your Transaction ID');
      return;
    }

    setLoading(true);

    try {
      // Get user data from cookie
      const userData = Cookies.get('user');
      if (!userData) {
        alert('Session expired. Please register again.');
        router.push('/party31/register');
        return;
      }

      const user = JSON.parse(userData);

      // Update payment status in database
      const response = await fetch('/api/party31/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          transactionId: transactionId.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/party31/success');
      } else {
        alert(result.error || 'Failed to confirm payment. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-gray-600 mb-6">Scan QR code or tap button to pay</p>
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <p className="text-3xl font-extrabold tracking-tight">₹{amount}</p>
          <span className="text-gray-400 line-through">₹549</span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/qr.jpg"
            alt="Payment QR Code" 
            className="rounded-lg shadow-md"
            width={250}
            height={250}
          />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          UPI ID: <span className="font-semibold">{adminUpiId}</span>
        </p>

        {!showConfirmation ? (
          <>
            {/* Pay with UPI button */}
            <button 
              onClick={handlePayWithAnyUPI}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition mb-3"
            >
              Pay Now
            </button>

            <button 
              onClick={() => setShowConfirmation(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              I have completed payment
            </button>
          </>
        ) : (
          <>
            {/* Transaction ID input */}
            <div className="text-left mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Transaction ID / UTR Number
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., 123456789012"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Find this in your payment app after successful payment
              </p>
            </div>

            <button 
              onClick={handleConfirmPayment}
              disabled={loading}
              className={`w-full font-semibold px-8 py-3 rounded-lg transition mb-3 ${
                loading 
                  ? 'bg-gray-400 text-gray-200' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Verifying...' : 'Confirm Payment'}
            </button>

            <button 
              onClick={() => setShowConfirmation(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back
            </button>
          </>
        )}

        <button 
          onClick={() => router.push('/party31/register')}
          className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm block w-full"
        >
          ← Back to Registration
        </button>
      </div>
    </div>
  )
}

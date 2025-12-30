'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie'

const passPrices: { [key: string]: { price: number; name: string } } = {
  stag: { price: 599, name: 'Stag Pass' },
  couple: { price: 1099, name: 'Couple Pass' },
  family: { price: 550, name: 'Family Pass (per person)' },
};

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [passType, setPassType] = useState('stag');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('')
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const type = searchParams.get('passType');
    if (type && passPrices[type]) {
      setPassType(type);
      // For couple pass, default quantity is 1 (means 1 couple)
      if (type === 'couple') {
        setQuantity(1);
      }
    }
  }, [searchParams]);

  const getPrice = () => {
    return passPrices[passType]?.price || 599;
  };

  const getTotalAmount = () => {
    return quantity * getPrice();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    try {
      // Save registration data to database
      const response = await fetch('/api/party31/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, gender, age, quantity, passType
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // Store user data in cookie for payment page
      Cookies.set('user', JSON.stringify({
        name, email, phone, gender, age, quantity, passType, totalAmount: getTotalAmount()
      }), { expires: 1 });

      // Redirect to pay page with QR code
      router.push('/party31/pay');

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur border border-gray-200 shadow-xl rounded-2xl">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Register for 31st Night Party</h1>
          <p className="text-sm text-gray-500 mt-2">Fill in your details and proceed to secure payment. Your entry QR will be emailed after successful payment.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Phone</span>
              <input
                type="tel"
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="xxxx-xxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium">Gender</span>
                <select
                  name="gender"
                  id="gender"
                  className='mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500'
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Age</span>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 21"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Quantity (Number of Passes)</span>
              <input
                type="number"
                min={1}
                max={10}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </label>

            <div className="rounded-lg bg-indigo-50 p-3 text-sm">
              <p className="font-semibold text-indigo-900">Pass Type: {passPrices[passType]?.name}</p>
              <p className="font-semibold text-indigo-900 mt-1">Total Amount: ₹{getTotalAmount()}</p>
              <p className="text-xs text-indigo-700 mt-1">{quantity} pass(es) × ₹{getPrice()}</p>
            </div>

            <button type="submit" disabled={loading} className={`mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${loading ? 'bg-gray-200 text-gray-600' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
              {loading ? 'Redirecting…' : `Proceed to Pay ₹${getTotalAmount()}`}
            </button>

            <p className="text-xs text-gray-500 mt-3">You will be redirected to the payment page with QR code.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Register31Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

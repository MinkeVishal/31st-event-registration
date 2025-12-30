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

            {/* Pass Type Selection */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Select Pass Type</span>
              
              {/* Stag Pass */}
              <div 
                onClick={() => { if (passType !== 'stag') { setPassType('stag'); setQuantity(1); } }}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${passType === 'stag' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">🎫 Stag Pass</p>
                    <p className="text-xs text-gray-500">Single entry</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600">₹599</p>
                </div>
                {passType === 'stag' && (
                  <div className="mt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-lg font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Couple Pass */}
              <div 
                onClick={() => { if (passType !== 'couple') { setPassType('couple'); setQuantity(1); } }}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${passType === 'couple' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">💑 Couple Pass</p>
                    <p className="text-xs text-gray-500">Entry for 2 people</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600">₹1099</p>
                </div>
                {passType === 'couple' && (
                  <div className="mt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-lg font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Family Pass */}
              <div 
                onClick={() => { if (passType !== 'family') { setPassType('family'); setQuantity(1); } }}
                className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${passType === 'family' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">👨‍👩‍👧‍👦 Family Pass</p>
                    <p className="text-xs text-gray-500">Price per person</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600">₹550<span className="text-sm font-normal">/person</span></p>
                </div>
                {passType === 'family' && (
                  <div className="mt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
                    <label className="text-sm text-gray-600">Number of people:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-lg font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">{passPrices[passType]?.name}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {quantity} × ₹{getPrice()}
                  </p>
                </div>
                <p className="text-2xl font-bold">₹{getTotalAmount()}</p>
              </div>
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

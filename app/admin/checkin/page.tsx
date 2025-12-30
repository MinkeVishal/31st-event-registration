'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface UserInfo {
  name: string
  email: string
  passType: string
  quantity: number
  checkedIn: boolean
}

export default function CheckinPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const ADMIN_PASSWORD = 'party31admin' // Change this!

  const onScanSuccess = async (decodedText: string) => {
    if (scanResult === decodedText) return // Prevent duplicate scans
    
    setScanResult(decodedText)
    setStatus('loading')

    try {
      const response = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: decodedText }),
      })
    // ...existing code...
  }

  useEffect(() => {
    if (!isAuthenticated) return

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    )

    scanner.render(onScanSuccess, onScanFailure)
    scannerRef.current = scanner

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [isAuthenticated, onScanSuccess])

      const data = await response.json()

      if (data.success) {
        setUserInfo(data.user)
        if (data.alreadyCheckedIn) {
          setStatus('already')
          setMessage('Already checked in!')
        } else {
          setStatus('success')
          setMessage('Check-in successful!')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Invalid QR code')
        setUserInfo(null)
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to verify QR code')
      setUserInfo(null)
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setScanResult(null)
      setStatus('idle')
      setUserInfo(null)
      setMessage('')
    }, 3000)
  }

  const onScanFailure = (error: string) => {
    // Silently handle scan failures
  }

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Wrong password!')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">🎫 Check-in Login</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">🎫 Event Check-in</h1>

        {/* Scanner */}
        <div className="bg-white rounded-xl overflow-hidden mb-6">
          <div id="qr-reader" className="w-full"></div>
        </div>

        {/* Status Display */}
        {status !== 'idle' && (
          <div className={`p-6 rounded-xl text-center mb-6 ${
            status === 'loading' ? 'bg-gray-700' :
            status === 'success' ? 'bg-green-600' :
            status === 'already' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {status === 'loading' ? (
              <p className="text-xl">⏳ Verifying...</p>
            ) : (
              <>
                <p className="text-3xl mb-2">
                  {status === 'success' ? '✅' : status === 'already' ? '⚠️' : '❌'}
                </p>
                <p className="text-xl font-bold">{message}</p>
                {userInfo && (
                  <div className="mt-4 text-left bg-white/20 p-4 rounded-lg">
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Pass:</strong> {userInfo.passType} × {userInfo.quantity}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 p-4 rounded-xl text-center">
          <p className="text-gray-400">Point camera at guest&apos;s QR code</p>
        </div>

        {/* Back to Admin */}
        <div className="mt-6 text-center">
          <a
            href="/admin"
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Admin Panel
          </a>
        </div>
      </div>
    </div>
  )
}

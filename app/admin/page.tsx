'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  phone: string
  gender: string
  age: number
  passType: string
  quantity: number
  paymentStatus: boolean
  transactionID: string | null
  referral: string
  checkedIn: boolean
  createdAt: string
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'checkedin'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const ADMIN_PASSWORD = 'party31admin' // Change this!

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchUsers()
    } else {
      alert('Wrong password!')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'paid' ? user.paymentStatus :
      filter === 'unpaid' ? !user.paymentStatus :
      filter === 'checkedin' ? user.checkedIn : true

    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      (user.transactionID?.includes(searchTerm) ?? false)

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: users.length,
    paid: users.filter(u => u.paymentStatus).length,
    unpaid: users.filter(u => !u.paymentStatus).length,
    checkedIn: users.filter(u => u.checkedIn).length,
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
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
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎉 Party31 Admin Panel</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Registrations</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Paid</p>
            <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Unpaid</p>
            <p className="text-3xl font-bold text-red-600">{stats.unpaid}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Checked In</p>
            <p className="text-3xl font-bold text-blue-600">{stats.checkedIn}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, email, phone, transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <div className="flex gap-2">
            {(['all', 'paid', 'unpaid', 'checkedin'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'paid' ? 'Paid' : f === 'unpaid' ? 'Unpaid' : 'Checked In'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Pass</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Transaction ID</th>
                  <th className="px-4 py-3 text-left">Referral</th>
                  <th className="px-4 py-3 text-left">Check-in</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3 capitalize">{user.passType}</td>
                    <td className="px-4 py-3">{user.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.paymentStatus 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.paymentStatus ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{user.transactionID || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{user.referral || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.checkedIn 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.checkedIn ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center py-10 text-gray-500">No users found</p>
            )}
          </div>
        )}

        {/* Check-in Scanner Link */}
        <div className="mt-6 text-center">
          <a
            href="/admin/checkin"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            📱 Open Check-in Scanner
          </a>
        </div>
      </div>
    </div>
  )
}

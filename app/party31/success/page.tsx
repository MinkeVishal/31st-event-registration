'use client'

import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function Success31 () {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQrCode = async () => {
            const userData = Cookies.get('user');
            if (userData) {
                const user = JSON.parse(userData);
                setUserName(user.name);
                
                // Fetch QR code from database
                try {
                    const response = await fetch('/api/party31/get-qr', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email }),
                    });
                    const result = await response.json();
                    if (result.success && result.qrCode) {
                        setQrCode(result.qrCode);
                    }
                } catch (error) {
                    console.error('Error fetching QR code:', error);
                }
            }
            setLoading(false);
            
            // Clean up cookies
            Cookies.remove('user');
        };

        fetchQrCode();
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900 text-white">
            <div className="absolute inset-0">
                <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-500/30 via-amber-400/30 to-orange-400/20 blur-3xl" aria-hidden="true" />
                <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-400/20 via-cyan-300/20 to-emerald-300/20 blur-3xl" aria-hidden="true" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.07),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_40%)]" aria-hidden="true" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-5 py-16">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[0.7rem] font-semibold tracking-[0.28em] backdrop-blur border border-white/20 font-finale shadow-lg shadow-purple-500/20">
                    <span role="img" aria-label="sparkles">🎆</span>
                    The Grand Finale: Year-End 2K25
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
                    <div className="grid md:grid-cols-[1.15fr_0.85fr] items-stretch">
                        <div className="p-8 md:p-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-200 text-xs font-semibold border border-emerald-300/30">Confirmed</div>
                            <h1 className="mt-4 text-4xl md:text-5xl font-display font-extrabold leading-tight text-white">
                                Thank you{userName ? `, ${userName.split(' ')[0]}` : ''}! Your registration is confirmed.
                            </h1>
                            <p className="mt-4 text-lg text-slate-200">
                                Here is your entry QR code. Screenshot it or show this page at the venue for check-in.
                            </p>

                            {/* QR Code Display */}
                            <div className="mt-6 flex justify-center">
                                {loading ? (
                                    <div className="w-64 h-64 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <p className="text-slate-300">Loading QR Code...</p>
                                    </div>
                                ) : qrCode ? (
                                    <div className="bg-white p-4 rounded-2xl shadow-xl">
                                        <img src={qrCode} alt="Your Entry QR Code" className="w-56 h-56" />
                                    </div>
                                ) : (
                                    <div className="w-64 h-64 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <p className="text-slate-300 text-center px-4">QR code will be sent to your email</p>
                                    </div>
                                )}
                            </div>

                            <p className="mt-4 text-sm text-amber-200 text-center">
                                📸 Take a screenshot of this QR code now!
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3 justify-center">
                                <a href="/" className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-lg shadow-white/20 transition hover:translate-y-px hover:shadow-xl">Back to home</a>
                                <a href="/party31/register" className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Register another guest</a>
                            </div>
                        </div>

                        <div className="relative h-full bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-8 py-10 md:px-10 border-l border-white/10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_35%)]" aria-hidden="true" />
                            <div className="relative z-10 flex flex-col gap-5">
                                <div className="rounded-2xl border border-white/15 bg-black/30 p-5 shadow-xl">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Event Details</p>
                                    <p className="mt-2 text-2xl font-display font-bold text-white">31st Night Party</p>
                                    <p className="mt-2 text-sm text-slate-200">📅 Dec 31, 2025</p>
                                    <p className="mt-1 text-sm text-slate-200">🕖 6:30 PM - 12:30 AM</p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-black/30 p-5 shadow-xl">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Check-in Instructions</p>
                                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                        <li>✓ Show this QR code at entry</li>
                                        <li>✓ Bring a valid ID</li>
                                        <li>✓ Arrive on time to skip queues</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

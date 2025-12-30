'use client'

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from "swiper/modules";
import { useState } from "react";

interface PassType {
  id: string;
  name: string;
  description: string;
  price: number;
}

const passCategories: PassType[] = [
  {
    id: 'stag',
    name: 'Stag Pass',
    description: 'Solo entry',
    price: 599,
  },
  {
    id: 'couple',
    name: 'Couple Pass',
    description: '2 guests',
    price: 1099,
  },
  {
    id: 'family',
    name: 'Family Group',
    description: '5–6+ guests: ₹550 per pass',
    price: 550,
  },
];

export default function Home() {
  const [selectedPass, setSelectedPass] = useState<string>('stag');
  return (
    <main className="font-playpen bg-black text-white">
      <div className="relative w-full mx-auto max-w-[500px] flex flex-col items-center justify-between pb-20">
        <div className="relative h-[500px] w-full rounded-lg">
          <Image src={'/Poster.jpg'} fill alt="poster" className="object-contain" />
        </div>
        <p className="border mt-3 rounded-full px-3 py-1 text-sm">Scroll ↓</p>
        <h1 className="text-4xl text-center mt-5 font-lobster p-4">🎆 THE GRAND FINALE: YEAR-END 2K25 🎆</h1>
        <h2 className="text-2xl font-bold text-red-100 my-3 text-center">Trip Goals presents the most electrifying night in Chhatrapati Sambhajinagar</h2>

        <div className="flex justify-between gap-14 items-center mt-5 text-center text-xl">
          <p>Time <br />6:30 PM – 12:30 AM</p>
          <p>Date <br />Wed, Dec 31, 2025</p>
        </div>

        <h3 className="text-xl font-medium bg-gradient-to-br bg-clip-text text-transparent p-5 py-8 from-red-300 to-orange-600 mt-3 text-center">Say goodbye to 2K25 and kick off the New Year with pure energy, rhythm, and style.</h3>

        <div className="w-full px-4 mt-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-purple-500/10">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-2xl font-lobster">Pass Categories</h3>
              <span className="text-xs uppercase tracking-[0.2em] border border-white/20 rounded-full px-3 py-1 bg-white/10">Limited</span>
            </div>
            
            {/* Pass Type Selector Buttons */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {passCategories.map((pass) => (
                <button
                  key={pass.id}
                  onClick={() => setSelectedPass(pass.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedPass === pass.id
                      ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/25'
                      : 'border border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {pass.name}
                </button>
              ))}
            </div>

            {/* Display Selected Pass Details */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              {passCategories.map((pass) => (
                selectedPass === pass.id && (
                  <div key={pass.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-4 animate-in fade-in duration-300">
                    <div>
                      <p className="text-lg font-semibold">{pass.name}</p>
                      <p className="text-sm text-gray-300">{pass.description}</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-300">₹{pass.price}</p>
                  </div>
                )
              ))}
            </div>

            <p className="mt-3 text-xs text-gray-300">*Family pricing applies when your group size goes beyond 5/6. Contact us if you need help choosing the right mix.</p>
            <div className="mt-4 flex">
              <Link href={`/party31/register?passType=${selectedPass}`} className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all">Book your pass</Link>
            </div>
          </div>
        </div>

        <div className="mt-5 flex w-full bg-stone-900 flex-col">
          <div className="relative w-full h-72">
            <Image src={'/dj.jpg'} alt="dj" fill className="object-cover" />
            <div className="absolute -top-1 left-0 h-20 bg-gradient-to-b from-black w-full"></div>
            <div className="absolute -bottom-1 left-0 h-20 bg-gradient-to-t from-stone-900 w-full"></div>
          </div>
          <h3 className="text-3xl text-center font-lobster text-white">Let the Beats Drop!</h3>
          <p className="text-stone-100 text-center text-xl p-5">Our DJ is spinning the hottest tracks to keep the dance floor on fire all night long.</p>
        </div>

        <div className="h-14 bg-gradient-to-b from-stone-900 w-full"></div>

        <div className="mt-5 flex w-full flex-col p-4">
          <h3 className="text-3xl text-center font-lobster text-white">Feast Like a Star!</h3>
          <p className="text-stone-100 text-center text-xl p-5">Enjoy a mouth-watering menu:</p>
          <div className="border border-gray-500 rounded-xl p-5 text-xl space-y-3">
            <p>Start your evening with a refreshing <br /><strong>Welcome Drink.</strong></p>
            <p className="mt-4">Then dive into our <strong>Special Thali:</strong></p>
            <ul className="ml-6 list-disc">
              <li>Paneer Masala</li>
              <li>Dal Tadka</li>
              <li>Puri/Chapati</li>
              <li>Jeera Rice</li>
            </ul>
            <p className="mt-4">End the meal on a sweet note with <br /> <strong>Gulab Jamun</strong></p>
          </div>
        </div>

        <div className="px-4 w-full">
          <div className="w-full mt-5 bg-stone-800 p-4 rounded-xl">
            <h2 className="text-3xl text-center font-lobster text-white">Event Highlights</h2>
            <ul className="list-none space-y-2 mt-5">
              <li>🎧 DJ spinning the hottest tracks</li>
              <li>🥂 Bar counter with your choice of drinks</li>
              <li>🍸 Complimentary shots for participants</li>
              <li>🍽️ Starters and main course to keep you fueled</li>
              <li>✨ Legendary surprises and high-energy vibe</li>
            </ul>

            <div className="mt-5 w-full flex">
              <Link
                href='/party31/register'
                className="bg-gradient-to-r from-teal-700 to-sky-700 text-white rounded-lg text-center font-medium text-xl py-2 w-full"
              >
                Register Now
              </Link>
            </div>

          </div>
        </div>

        <div className="mt-5 flex w-full flex-col p-4">
          <h3 className="text-3xl text-center font-lobster text-white">Location</h3>
          <p className="text-stone-100 text-center text-xl p-5">Aditya by Meraki, Beed Bypass Road (Opposite Spice Tree Hotel), Chhatrapati Sambhajinagar</p>

          <Swiper
            spaceBetween={30}
            slidesPerView={'auto'}
            modules={[Pagination]}
            pagination={{ clickable: true }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <SwiperSlide key={item} style={{ width: 'auto' }} className="pb-3">
                <img src={`./hotel/${item}.jpg`} alt={`${item}-image`} className="h-60 rounded-lg" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="w-full mt-10 h-auto rounded space-y-3">
            <iframe
              src="https://www.google.com/maps?q=Aditya%20by%20Meraki%20Beed%20Bypass%20Road%20Opposite%20Spice%20Tree%20Hotel%20Chhatrapati%20Sambhajinagar&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <a
              href="https://maps.app.goo.gl/4jiPQsjzAxkQTf12A?g_st=aw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white text-black font-semibold py-2"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <div className="mt-5 flex w-full flex-col p-4 bg-[#ff171715]">
          <h3 className="text-3xl text-center font-lobster text-white">Rules</h3>
          <ul className="ml-6 mt-5 list-disc">
            <li>Alcohol strictly prohibited</li>
            <li>Smoking is not allowed</li>
            <li>Entry only with a valid pass</li>
            <li>Please maintain your standards</li>
          </ul>
          <p className="text-xs mt-4">Bouncers will be available to ensure everyone has a safe and enjoyable time!</p>
        </div>

        <div className="mt-5 px-4">
          <p className="mt-5 text-center">Event organised and managed by <br /><strong>Shoaib Pathan</strong></p>
          <a href={'https://instagram.com/princ_shoaib'} target="_blank" className="mb-5 mt-3 w-max flex items-center justify-center gap-2 py-1 px-3 mx-auto border rounded-full">
            <Image src={'/instagram.svg'} alt="instagram" height={20} width={20} />
            <p>@princ_shoaib</p>
          </a>
          <h4 className="font-bold text-sm">Policy</h4>
          <p className="text-sm text-gray-300 mb-3">Refunds are not available</p>
          <h4 className="font-bold text-sm">Special Thanks to</h4>
          <p className="text-sm text-gray-300 mb-3">
            <a href={'https://vishalminke.me'} className="underline" target="_blank">Devloped By @vishal_minke</a>
          </p>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Link
            href={`/party31/register?passType=${selectedPass}`}
            className="block w-full bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 rounded-xl text-center font-bold text-lg text-white px-6 py-3 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            Register Now
          </Link>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function SearchForm({
  defaultDestination = "",
}: {
  defaultDestination?: string;
}) {
  const router = useRouter();
  const [destination, setDestination] = useState(defaultDestination);
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(2));
  const [guests, setGuests] = useState(2);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-accent/95 p-2 rounded-lg shadow-lg flex flex-col md:flex-row gap-2"
    >
      <input
        type="text"
        required
        placeholder="Where are you going?"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="flex-1 min-w-0 rounded px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="grid grid-cols-2 gap-2 flex-1 min-w-0">
          <label className="min-w-0 flex flex-col justify-center bg-white rounded px-3 py-1.5">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase">
              Check-in
            </span>
            <input
              type="date"
              required
              value={checkIn}
              min={todayISO()}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full min-w-0 text-sm text-neutral-900 focus:outline-none"
            />
          </label>
          <label className="min-w-0 flex flex-col justify-center bg-white rounded px-3 py-1.5">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase">
              Check-out
            </span>
            <input
              type="date"
              required
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full min-w-0 text-sm text-neutral-900 focus:outline-none"
            />
          </label>
        </div>
        <label className="sm:w-28 flex flex-col justify-center bg-white rounded px-3 py-1.5">
          <span className="text-[10px] font-semibold text-neutral-500 uppercase">
            Guests
          </span>
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full text-sm text-neutral-900 focus:outline-none"
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-brand-light hover:bg-brand text-white font-semibold px-8 py-3 rounded cursor-pointer transition-colors"
      >
        Search
      </button>
    </form>
  );
}

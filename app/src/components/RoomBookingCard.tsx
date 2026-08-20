"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function RoomBookingCard({
  room,
}: {
  room: {
    id: string;
    name: string;
    pricePerNight: number;
    maxGuests: number;
    quantity: number;
  };
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(2));
  const [guests, setGuests] = useState(2);

  function reserve() {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/booking/${room.id}?${params.toString()}`);
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div>
        <h3 className="font-semibold">{room.name}</h3>
        <p className="text-sm text-neutral-500">
          Up to {room.maxGuests} guests · {room.quantity} available
        </p>
        <p className="text-lg font-bold text-neutral-900 mt-1">
          ${room.pricePerNight.toFixed(0)}{" "}
          <span className="text-xs font-normal text-neutral-500">/ night</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
        <label className="text-xs text-neutral-500">
          Check-in
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => setCheckIn(e.target.value)}
            className="block border border-neutral-300 rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="text-xs text-neutral-500">
          Check-out
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="block border border-neutral-300 rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="text-xs text-neutral-500">
          Guests
          <input
            type="number"
            min={1}
            max={room.maxGuests}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="block border border-neutral-300 rounded px-2 py-1 text-sm w-16"
          />
        </label>
        <button
          onClick={reserve}
          className="bg-brand-light hover:bg-brand text-white font-semibold px-5 py-2 rounded cursor-pointer h-fit"
        >
          Reserve
        </button>
      </div>
    </div>
  );
}

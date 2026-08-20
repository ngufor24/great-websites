"use client";

import { useActionState } from "react";
import { createBookingAction } from "@/lib/actions";

export default function BookingForm({
  roomId,
  checkIn,
  checkOut,
  guests,
  maxGuests,
}: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  maxGuests: number;
}) {
  const [state, formAction, pending] = useActionState(createBookingAction, undefined);

  return (
    <form action={formAction} className="bg-white border border-neutral-200 rounded-lg p-4">
      <input type="hidden" name="roomId" value={roomId} />
      {state?.error && (
        <p className="text-red-600 text-sm mb-3">{state.error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Check-in</span>
          <input
            type="date"
            name="checkIn"
            defaultValue={checkIn}
            required
            className="w-full border border-neutral-300 rounded px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Check-out</span>
          <input
            type="date"
            name="checkOut"
            defaultValue={checkOut}
            required
            className="w-full border border-neutral-300 rounded px-2 py-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Guests</span>
          <input
            type="number"
            name="guests"
            defaultValue={guests}
            min={1}
            max={maxGuests}
            required
            className="w-full border border-neutral-300 rounded px-2 py-1.5"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-light hover:bg-brand text-white font-semibold py-3 rounded cursor-pointer disabled:opacity-60"
      >
        {pending ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}

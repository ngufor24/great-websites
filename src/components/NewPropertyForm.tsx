"use client";

import { useActionState } from "react";
import { createPropertyAction } from "@/lib/actions";

const TYPES = ["HOTEL", "APARTMENT", "VILLA", "RESORT", "GUESTHOUSE"];

export default function NewPropertyForm() {
  const [state, formAction, pending] = useActionState(createPropertyAction, undefined);

  return (
    <form action={formAction} className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col gap-4">
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <fieldset className="flex flex-col gap-3">
        <legend className="font-semibold mb-1">Property details</legend>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Title</span>
          <input name="title" required className="w-full border border-neutral-300 rounded px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Description</span>
          <textarea name="description" required rows={3} className="w-full border border-neutral-300 rounded px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Type</span>
          <select name="type" className="w-full border border-neutral-300 rounded px-3 py-2">
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">City</span>
            <input name="city" required className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Country</span>
            <input name="country" required defaultValue="Cameroon" className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
        </div>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Address</span>
          <input name="address" required className="w-full border border-neutral-300 rounded px-3 py-2" />
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Max guests</span>
            <input type="number" name="maxGuests" min={1} defaultValue={2} required className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Bedrooms</span>
            <input type="number" name="bedrooms" min={0} defaultValue={1} required className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Bathrooms</span>
            <input type="number" name="bathrooms" min={0} defaultValue={1} required className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
        </div>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Amenities (comma separated)</span>
          <input name="amenities" placeholder="WiFi, Pool, Air conditioning" className="w-full border border-neutral-300 rounded px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Image URLs (comma separated, optional)</span>
          <input name="images" placeholder="https://..." className="w-full border border-neutral-300 rounded px-3 py-2" />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
        <legend className="font-semibold mb-1">First room type</legend>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Room name</span>
          <input name="roomName" required defaultValue="Standard Room" className="w-full border border-neutral-300 rounded px-3 py-2" />
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Price / night ($)</span>
            <input type="number" name="roomPrice" min={1} step="0.01" required defaultValue={50} className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Rooms available</span>
            <input type="number" name="roomQuantity" min={1} required defaultValue={1} className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-500 mb-1">Max guests / room</span>
            <input type="number" name="roomMaxGuests" min={1} required defaultValue={2} className="w-full border border-neutral-300 rounded px-3 py-2" />
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="bg-brand hover:bg-brand-light text-white font-semibold py-2.5 rounded cursor-pointer disabled:opacity-60"
      >
        {pending ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}

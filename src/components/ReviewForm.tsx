"use client";

import { useActionState } from "react";
import { createReviewAction } from "@/lib/actions";

export default function ReviewForm({ propertyId }: { propertyId: string }) {
  const [state, formAction, pending] = useActionState(createReviewAction, undefined);

  return (
    <form action={formAction} className="bg-white border border-neutral-200 rounded-lg p-4">
      <h3 className="font-semibold mb-2">Leave a review</h3>
      <input type="hidden" name="propertyId" value={propertyId} />
      {state?.error && (
        <p className="text-red-600 text-sm mb-2">{state.error}</p>
      )}
      <div className="flex gap-3 mb-2">
        <select
          name="rating"
          defaultValue="5"
          className="border border-neutral-300 rounded px-2 py-1.5 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>
      <textarea
        name="comment"
        required
        placeholder="Share your experience..."
        rows={3}
        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-brand hover:bg-brand-light text-white font-semibold px-4 py-2 rounded text-sm cursor-pointer disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

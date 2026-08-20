"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);
  const [role, setRole] = useState<"GUEST" | "HOST">("GUEST");

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an account</h1>
      <form action={formAction} className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col gap-3">
        {state?.error && (
          <p className="text-red-600 text-sm">{state.error}</p>
        )}
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Full name</span>
          <input
            type="text"
            name="name"
            required
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-500 mb-1">Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </label>

        <div className="text-sm">
          <span className="block text-neutral-500 mb-1">I want to</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("GUEST")}
              className={`flex-1 border rounded px-3 py-2 cursor-pointer ${
                role === "GUEST"
                  ? "border-brand bg-brand/5 font-semibold"
                  : "border-neutral-300"
              }`}
            >
              Book stays
            </button>
            <button
              type="button"
              onClick={() => setRole("HOST")}
              className={`flex-1 border rounded px-3 py-2 cursor-pointer ${
                role === "HOST"
                  ? "border-brand bg-brand/5 font-semibold"
                  : "border-neutral-300"
              }`}
            >
              List a property
            </button>
          </div>
          <input type="hidden" name="role" value={role} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-brand hover:bg-brand-light text-white font-semibold py-2.5 rounded cursor-pointer disabled:opacity-60 mt-2"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="text-center text-sm text-neutral-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-light font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

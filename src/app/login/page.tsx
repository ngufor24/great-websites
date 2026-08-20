"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
      <form action={formAction} className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col gap-3">
        {state?.error && (
          <p className="text-red-600 text-sm">{state.error}</p>
        )}
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
            className="w-full border border-neutral-300 rounded px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="bg-brand hover:bg-brand-light text-white font-semibold py-2.5 rounded cursor-pointer disabled:opacity-60 mt-2"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-center text-sm text-neutral-500 mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-light font-semibold hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

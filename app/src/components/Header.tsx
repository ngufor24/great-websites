import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/signout-action";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-brand text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          237<span className="text-accent">booking</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <Link
            href="/search?category=stays"
            className="px-3 py-1.5 rounded-full hover:bg-white/10"
          >
            Stays
          </Link>
          <Link
            href="/search?category=cars"
            className="px-3 py-1.5 rounded-full hover:bg-white/10"
          >
            Car rental
          </Link>
          <Link
            href="/search?category=flights"
            className="px-3 py-1.5 rounded-full hover:bg-white/10"
          >
            Flights
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-sm">
          {session?.user ? (
            <>
              {session.user.role === "HOST" && (
                <Link
                  href="/host"
                  className="px-3 py-1.5 rounded hover:bg-white/10"
                >
                  Host dashboard
                </Link>
              )}
              <Link
                href="/account/bookings"
                className="px-3 py-1.5 rounded hover:bg-white/10"
              >
                My bookings
              </Link>
              <span className="px-2 hidden md:inline">
                {session.user.name}
              </span>
              <form action={signOutAction}>
                <button className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded bg-white text-brand font-semibold hover:bg-white/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

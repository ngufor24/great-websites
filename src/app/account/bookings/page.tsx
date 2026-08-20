import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BookingsPage({
  searchParams,
}: PageProps<"/account/bookings">) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/bookings");

  const sp = await searchParams;
  const confirmedId = typeof sp.confirmed === "string" ? sp.confirmed : null;

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { property: true, room: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My bookings</h1>

      {confirmedId && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 text-sm">
          Your booking is confirmed! You&apos;ll find the details below.
        </div>
      )}

      {bookings.length === 0 ? (
        <p className="text-neutral-500">
          You don&apos;t have any bookings yet.{" "}
          <Link href="/search" className="text-brand-light hover:underline">
            Start searching
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className={`bg-white border rounded-lg p-4 ${
                b.id === confirmedId ? "border-green-400 ring-1 ring-green-300" : "border-neutral-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/property/${b.propertyId}`} className="font-semibold text-brand-light hover:underline">
                    {b.property.title}
                  </Link>
                  <p className="text-sm text-neutral-500">{b.room.name}</p>
                  <p className="text-sm text-neutral-500">
                    {b.checkIn.toISOString().slice(0, 10)} → {b.checkOut.toISOString().slice(0, 10)} · {b.guests} guest{b.guests === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold">${Number(b.totalPrice).toFixed(0)}</div>
                  <div className="text-xs text-neutral-500 capitalize">{b.status.toLowerCase()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

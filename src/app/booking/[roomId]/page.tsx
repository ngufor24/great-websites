import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import BookingForm from "@/components/BookingForm";

export default async function BookingPage({
  params,
  searchParams,
}: PageProps<"/booking/[roomId]">) {
  const { roomId } = await params;
  const sp = await searchParams;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/booking/${roomId}`);
  }

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { property: true },
  });
  if (!room) notFound();

  const checkIn = typeof sp.checkIn === "string" ? sp.checkIn : "";
  const checkOut = typeof sp.checkOut === "string" ? sp.checkOut : "";
  const guests = typeof sp.guests === "string" ? Number(sp.guests) : 1;

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;
  const total = nights * Number(room.pricePerNight);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Confirm your booking</h1>
      <p className="text-neutral-500 mb-6">
        {room.property.title} — {room.name}
      </p>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-6">
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-neutral-500">Check-in</dt>
          <dd className="text-right font-medium">{checkIn || "—"}</dd>
          <dt className="text-neutral-500">Check-out</dt>
          <dd className="text-right font-medium">{checkOut || "—"}</dd>
          <dt className="text-neutral-500">Guests</dt>
          <dd className="text-right font-medium">{guests}</dd>
          <dt className="text-neutral-500">Nights</dt>
          <dd className="text-right font-medium">{nights}</dd>
          <dt className="text-neutral-500 font-semibold">Total price</dt>
          <dd className="text-right font-bold text-lg">${total.toFixed(0)}</dd>
        </dl>
      </div>

      <BookingForm
        roomId={room.id}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        maxGuests={room.maxGuests}
      />
    </div>
  );
}

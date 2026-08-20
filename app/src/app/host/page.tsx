import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HostDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/host");
  if (session.user.role !== "HOST") {
    redirect("/");
  }

  const properties = await prisma.property.findMany({
    where: { hostId: session.user.id },
    include: {
      rooms: true,
      bookings: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your properties</h1>
        <Link
          href="/host/new"
          className="bg-brand hover:bg-brand-light text-white font-semibold px-4 py-2 rounded"
        >
          + Add property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-neutral-500">
          You haven&apos;t listed any properties yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/property/${p.id}`}
              className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-neutral-500">
                  {p.city}, {p.country} · {p.rooms.length} room type
                  {p.rooms.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="text-sm text-neutral-500">
                {p.bookings.length} booking{p.bookings.length === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

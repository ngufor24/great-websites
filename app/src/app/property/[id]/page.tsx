import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RoomBookingCard from "@/components/RoomBookingCard";
import ReviewForm from "@/components/ReviewForm";

export default async function PropertyPage({
  params,
}: PageProps<"/property/[id]">) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      rooms: true,
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
      host: true,
    },
  });

  if (!property) notFound();

  const avgRating = property.reviews.length
    ? property.reviews.reduce((a, r) => a + r.rating, 0) / property.reviews.length
    : 0;

  const images = property.images.length
    ? property.images
    : ["/seed/property-default.svg"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/search" className="hover:underline">
          Search
        </Link>{" "}
        / {property.title}
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
        {property.title}
      </h1>
      <p className="text-neutral-500 mb-4">
        {property.address}, {property.city}, {property.country}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 rounded-lg overflow-hidden">
        <div className="relative col-span-2 row-span-2 h-64 sm:h-80">
          <Image
            src={images[0]}
            alt={property.title}
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative h-32 sm:h-[9.5rem]">
            <Image
              src={img}
              alt={`${property.title} photo ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2">About this property</h2>
            <p className="text-neutral-700 whitespace-pre-line">
              {property.description}
            </p>
            <div className="flex gap-6 mt-4 text-sm text-neutral-600">
              <span>{property.maxGuests} guests max</span>
              <span>{property.bedrooms} bedrooms</span>
              <span>{property.bathrooms} bathrooms</span>
              <span className="capitalize">{property.type.toLowerCase()}</span>
            </div>
          </section>

          {property.amenities.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-2">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-neutral-700">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <span className="text-brand-light">✓</span> {a}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Available rooms</h2>
            <div className="flex flex-col gap-3">
              {property.rooms.map((room) => (
                <RoomBookingCard
                  key={room.id}
                  room={{
                    id: room.id,
                    name: room.name,
                    pricePerNight: Number(room.pricePerNight),
                    maxGuests: room.maxGuests,
                    quantity: room.quantity,
                  }}
                />
              ))}
              {property.rooms.length === 0 && (
                <p className="text-neutral-500 text-sm">
                  No rooms currently listed for this property.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">
              Reviews{" "}
              {property.reviews.length > 0 && (
                <span className="text-neutral-500 font-normal text-base">
                  ({avgRating.toFixed(1)} · {property.reviews.length})
                </span>
              )}
            </h2>
            <div className="flex flex-col gap-4 mb-6">
              {property.reviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-200 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-brand text-white text-xs font-semibold rounded px-1.5 py-0.5">
                      {review.rating}
                    </span>
                    <span className="font-medium text-sm">
                      {review.user.name}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700">{review.comment}</p>
                </div>
              ))}
              {property.reviews.length === 0 && (
                <p className="text-neutral-500 text-sm">
                  No reviews yet. Be the first to stay and leave one!
                </p>
              )}
            </div>
            <ReviewForm propertyId={property.id} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-4 h-fit bg-white rounded-lg shadow p-4 border border-neutral-200">
          <h3 className="font-semibold mb-2">Hosted by {property.host.name}</h3>
          <p className="text-sm text-neutral-500 mb-4">
            {property.rooms.length > 0
              ? `From $${Math.min(
                  ...property.rooms.map((r) => Number(r.pricePerNight))
                ).toFixed(0)} / night`
              : "Pricing unavailable"}
          </p>
          <p className="text-sm text-neutral-600">
            Select a room below to check availability and book your stay.
          </p>
        </aside>
      </div>
    </div>
  );
}

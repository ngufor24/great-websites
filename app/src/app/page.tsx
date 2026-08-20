import SearchForm from "@/components/SearchForm";
import PropertyCard, { PropertyCardData } from "@/components/PropertyCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const destinations = [
  { city: "Douala", country: "Cameroon", image: "/seed/dest-douala.svg" },
  { city: "Yaoundé", country: "Cameroon", image: "/seed/dest-yaounde.svg" },
  { city: "Limbe", country: "Cameroon", image: "/seed/dest-limbe.svg" },
  { city: "Buea", country: "Cameroon", image: "/seed/dest-buea.svg" },
];

async function getFeaturedProperties(): Promise<PropertyCardData[]> {
  const properties = await prisma.property.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      rooms: { select: { pricePerNight: true } },
      reviews: { select: { rating: true } },
    },
  });

  return properties.map((p) => {
    const prices = p.rooms.map((r) => Number(r.pricePerNight));
    const ratings = p.reviews.map((r) => r.rating);
    return {
      id: p.id,
      title: p.title,
      city: p.city,
      country: p.country,
      type: p.type,
      images: p.images.length ? p.images : ["/seed/property-default.svg"],
      avgRating: ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0,
      reviewCount: ratings.length,
      minPrice: prices.length ? Math.min(...prices) : null,
    };
  });
}

export default async function Home() {
  const featured = await getFeaturedProperties();

  return (
    <div>
      <div className="bg-brand pb-16">
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <h1 className="text-white text-3xl sm:text-4xl font-bold mb-1">
            Find your next stay
          </h1>
          <p className="text-white/80 mb-6">
            Search hotels, apartments, and villas across Cameroon — deals for every kind of trip.
          </p>
          <SearchForm />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 -mt-10">
        <section className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Popular destinations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {destinations.map((d) => (
              <Link
                key={d.city}
                href={`/search?destination=${encodeURIComponent(d.city)}`}
                className="group relative h-32 rounded-lg overflow-hidden block"
              >
                <Image
                  src={d.image}
                  alt={d.city}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-2 left-2 text-white">
                  <div className="font-semibold">{d.city}</div>
                  <div className="text-xs opacity-90">{d.country}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">
              Newest stays
            </h2>
            <Link href="/search" className="text-brand-light text-sm font-semibold hover:underline">
              See all
            </Link>
          </div>
          {featured.length ? (
            <div className="grid gap-4">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">
              No listings yet.{" "}
              <Link href="/signup" className="text-brand-light hover:underline">
                Sign up as a host
              </Link>{" "}
              to add the first one.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

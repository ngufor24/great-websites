import { prisma } from "@/lib/prisma";
import PropertyCard, { PropertyCardData } from "@/components/PropertyCard";
import SearchForm from "@/components/SearchForm";
import { Prisma } from "@prisma/client";
import Link from "next/link";

const PROPERTY_TYPES = ["HOTEL", "APARTMENT", "VILLA", "RESORT", "GUESTHOUSE"] as const;

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const sp = await searchParams;
  const destination =
    typeof sp.destination === "string" ? sp.destination : "";
  const guests = typeof sp.guests === "string" ? Number(sp.guests) : undefined;
  const category = typeof sp.category === "string" ? sp.category : "stays";
  const selectedTypes = Array.isArray(sp.type)
    ? sp.type
    : sp.type
      ? [sp.type]
      : [];
  const maxPrice = typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined;

  if (category !== "stays") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">
          {category === "cars" ? "Car rental" : "Flights"} coming soon
        </h1>
        <p className="text-neutral-500 mb-6">
          We&apos;re currently focused on stays. Check back soon for{" "}
          {category === "cars" ? "car rental" : "flight"} search.
        </p>
        <Link
          href="/search?category=stays"
          className="inline-block bg-brand hover:bg-brand-light text-white font-semibold px-5 py-2.5 rounded"
        >
          Search stays instead
        </Link>
      </div>
    );
  }

  const where: Prisma.PropertyWhereInput = {};
  if (destination) {
    where.OR = [
      { city: { contains: destination, mode: "insensitive" } },
      { country: { contains: destination, mode: "insensitive" } },
      { title: { contains: destination, mode: "insensitive" } },
    ];
  }
  if (guests) {
    where.maxGuests = { gte: guests };
  }
  if (selectedTypes.length) {
    where.type = { in: selectedTypes as (typeof PROPERTY_TYPES)[number][] };
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      rooms: { select: { pricePerNight: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  let results: PropertyCardData[] = properties.map((p) => {
    const prices = p.rooms.map((r) => Number(r.pricePerNight));
    const ratings = p.reviews.map((r) => r.rating);
    return {
      id: p.id,
      title: p.title,
      city: p.city,
      country: p.country,
      type: p.type,
      images: p.images.length
        ? p.images
        : ["/seed/property-default.svg"],
      avgRating: ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0,
      reviewCount: ratings.length,
      minPrice: prices.length ? Math.min(...prices) : null,
    };
  });

  if (maxPrice) {
    results = results.filter((r) => r.minPrice === null || r.minPrice <= maxPrice);
  }

  return (
    <div className="bg-brand pb-8">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
        <SearchForm defaultDestination={destination} />
      </div>

      <div className="mx-auto max-w-6xl px-4 bg-background rounded-t-lg pt-6 min-h-[60vh]">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white rounded-lg shadow-sm p-4 h-fit">
            <h2 className="font-semibold mb-3">Filter by</h2>

            <form method="GET" className="flex flex-col gap-4">
              <input type="hidden" name="destination" value={destination} />
              {guests ? <input type="hidden" name="guests" value={guests} /> : null}

              <div>
                <h3 className="text-sm font-semibold mb-2">Property type</h3>
                <div className="flex flex-col gap-1.5">
                  {PROPERTY_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm capitalize">
                      <input
                        type="checkbox"
                        name="type"
                        value={t}
                        defaultChecked={selectedTypes.includes(t)}
                      />
                      {t.toLowerCase()}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Max price / night</h3>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={maxPrice ?? ""}
                  placeholder="Any"
                  className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-light hover:bg-brand text-white font-semibold py-2 rounded text-sm cursor-pointer"
              >
                Apply filters
              </button>
            </form>
          </aside>

          <div>
            <h1 className="text-lg font-semibold mb-4">
              {destination ? `Stays in ${destination}` : "All stays"}{" "}
              <span className="text-neutral-500 font-normal">
                · {results.length} found
              </span>
            </h1>
            {results.length ? (
              <div className="grid gap-4 pb-8">
                {results.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 pb-8">
                No stays match your search. Try a different destination or fewer filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

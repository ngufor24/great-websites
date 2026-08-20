import Link from "next/link";
import Image from "next/image";

export type PropertyCardData = {
  id: string;
  title: string;
  city: string;
  country: string;
  type: string;
  images: string[];
  avgRating: number;
  reviewCount: number;
  minPrice: number | null;
};

export default function PropertyCard({ property }: { property: PropertyCardData }) {
  return (
    <Link
      href={`/property/${property.id}`}
      className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-neutral-200"
    >
      <div className="relative w-full sm:w-56 h-40 shrink-0 rounded overflow-hidden bg-neutral-100">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="224px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-brand-light text-lg">
          {property.title}
        </h3>
        <p className="text-sm text-neutral-500">
          {property.city}, {property.country} ·{" "}
          <span className="capitalize">{property.type.toLowerCase()}</span>
        </p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-center gap-2">
            {property.reviewCount > 0 ? (
              <>
                <span className="bg-brand text-white text-sm font-semibold rounded px-1.5 py-0.5">
                  {property.avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-500">
                  {property.reviewCount} review
                  {property.reviewCount === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              <span className="text-xs text-neutral-400">No reviews yet</span>
            )}
          </div>
          <div className="text-right">
            {property.minPrice !== null ? (
              <>
                <div className="text-xs text-neutral-500">from</div>
                <div className="text-lg font-bold text-neutral-900">
                  ${property.minPrice.toFixed(0)}{" "}
                  <span className="text-xs font-normal text-neutral-500">
                    / night
                  </span>
                </div>
              </>
            ) : (
              <div className="text-xs text-neutral-400">No rooms listed</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

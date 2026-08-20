import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const host = await prisma.user.upsert({
    where: { email: "host@237booking.com" },
    update: {},
    create: {
      name: "Ngufor Properties",
      email: "host@237booking.com",
      passwordHash,
      role: "HOST",
    },
  });

  await prisma.user.upsert({
    where: { email: "guest@237booking.com" },
    update: {},
    create: {
      name: "Test Guest",
      email: "guest@237booking.com",
      passwordHash,
      role: "GUEST",
    },
  });

  const properties = [
    {
      title: "Seaside Villa Limbe",
      description:
        "A stunning villa overlooking the Atlantic coast in Limbe, steps from the black sand beach. Perfect for families and groups looking for a relaxing getaway.",
      type: "VILLA" as const,
      city: "Limbe",
      country: "Cameroon",
      address: "Down Beach Road",
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ["WiFi", "Pool", "Air conditioning", "Beach access", "Kitchen", "Parking"],
      images: [
        "/seed/villa-1.svg",
        "/seed/villa-2.svg",
        "/seed/villa-3.svg",
        "/seed/villa-4.svg",
        "/seed/villa-5.svg",
      ],
      rooms: [
        { name: "Entire Villa", pricePerNight: 180, maxGuests: 8, quantity: 1 },
      ],
    },
    {
      title: "Douala Business Hotel",
      description:
        "Modern hotel in the heart of Douala's business district, close to the airport and major offices. Ideal for business travelers.",
      type: "HOTEL" as const,
      city: "Douala",
      country: "Cameroon",
      address: "Boulevard de la Liberté",
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["WiFi", "Air conditioning", "Breakfast included", "Gym", "Business center"],
      images: [
        "/seed/hotel-1.svg",
        "/seed/hotel-2.svg",
        "/seed/hotel-3.svg",
      ],
      rooms: [
        { name: "Standard Room", pricePerNight: 60, maxGuests: 2, quantity: 10 },
        { name: "Executive Suite", pricePerNight: 110, maxGuests: 3, quantity: 4 },
      ],
    },
    {
      title: "Yaoundé City Apartment",
      description:
        "Cozy and modern apartment in Bastos, Yaoundé's diplomatic quarter. Walking distance to restaurants, embassies, and shopping.",
      type: "APARTMENT" as const,
      city: "Yaoundé",
      country: "Cameroon",
      address: "Bastos",
      maxGuests: 3,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["WiFi", "Kitchen", "Air conditioning", "Washing machine"],
      images: [
        "/seed/apt-1.svg",
        "/seed/apt-2.svg",
      ],
      rooms: [
        { name: "1-Bedroom Apartment", pricePerNight: 45, maxGuests: 3, quantity: 2 },
      ],
    },
    {
      title: "Buea Mountain Guesthouse",
      description:
        "A peaceful guesthouse at the foot of Mount Cameroon, offering fresh air and incredible views. Great base for hiking trips.",
      type: "GUESTHOUSE" as const,
      city: "Buea",
      country: "Cameroon",
      address: "Molyko",
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["WiFi", "Garden", "Breakfast included", "Mountain view"],
      images: [
        "/seed/guesthouse-1.svg",
        "/seed/guesthouse-2.svg",
      ],
      rooms: [
        { name: "Double Room", pricePerNight: 35, maxGuests: 2, quantity: 3 },
        { name: "Family Room", pricePerNight: 55, maxGuests: 5, quantity: 1 },
      ],
    },
  ];

  for (const p of properties) {
    const { rooms, ...propData } = p;
    const existing = await prisma.property.findFirst({
      where: { title: p.title },
    });
    if (existing) continue;

    await prisma.property.create({
      data: {
        ...propData,
        hostId: host.id,
        rooms: { create: rooms },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

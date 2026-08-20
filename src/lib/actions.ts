"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["GUEST", "HOST"]),
});

export type FormState = { error?: string } | undefined;

export async function signupAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "GUEST",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  await signIn("credentials", { email, password, redirectTo: "/" });
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw err;
  }
}

const propertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["HOTEL", "APARTMENT", "VILLA", "RESORT", "GUESTHOUSE"]),
  city: z.string().min(1),
  country: z.string().min(1),
  address: z.string().min(1),
  maxGuests: z.coerce.number().int().min(1),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  amenities: z.string().optional(),
  images: z.string().optional(),
  roomName: z.string().min(1),
  roomPrice: z.coerce.number().positive(),
  roomQuantity: z.coerce.number().int().min(1),
  roomMaxGuests: z.coerce.number().int().min(1),
});

export async function createPropertyAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "HOST") {
    return { error: "Only host accounts can list properties" };
  }

  const parsed = propertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  const amenities = data.amenities
    ? data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];
  const images = data.images
    ? data.images.split(",").map((a) => a.trim()).filter(Boolean)
    : [
        "/seed/property-default.svg",
      ];

  const property = await prisma.property.create({
    data: {
      hostId: session.user.id,
      title: data.title,
      description: data.description,
      type: data.type,
      city: data.city,
      country: data.country,
      address: data.address,
      maxGuests: data.maxGuests,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      amenities,
      images,
      rooms: {
        create: {
          name: data.roomName,
          pricePerNight: data.roomPrice,
          quantity: data.roomQuantity,
          maxGuests: data.roomMaxGuests,
          amenities: [],
        },
      },
    },
  });

  redirect(`/property/${property.id}`);
}

const bookingSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().int().min(1),
});

export async function createBookingAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in to book" };
  }

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { roomId, guests } = parsed.data;
  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);

  if (checkOut <= checkIn) {
    return { error: "Check-out date must be after check-in date" };
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return { error: "Room not found" };
  }
  if (guests > room.maxGuests) {
    return { error: `This room fits up to ${room.maxGuests} guests` };
  }

  const nights = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = Number(room.pricePerNight) * nights;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      propertyId: room.propertyId,
      roomId: room.id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: "CONFIRMED",
    },
  });

  redirect(`/account/bookings?confirmed=${booking.id}`);
}

const reviewSchema = z.object({
  propertyId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export async function createReviewAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in to leave a review" };
  }

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.review.create({
    data: {
      propertyId: parsed.data.propertyId,
      userId: session.user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  redirect(`/property/${parsed.data.propertyId}`);
}

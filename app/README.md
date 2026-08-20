# 237booking

A booking.com-style stays marketplace: search, property listings, room-level booking, guest accounts, and a host dashboard for listing properties.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, PostgreSQL + Prisma 7, and Auth.js (NextAuth v5) with credentials-based login.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** PostgreSQL via Prisma 7 (`@prisma/adapter-pg` driver adapter)
- **Auth:** Auth.js (next-auth v5) — email/password, JWT sessions, `GUEST` and `HOST` roles
- **Styling:** Tailwind CSS v4

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up PostgreSQL and copy the env file:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your `DATABASE_URL` and a random `AUTH_SECRET` (`openssl rand -base64 32`).

3. Run migrations and seed sample data (4 properties in Cameroon, a host account, and a guest account):

   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

   Seeded accounts (password for both: `password123`):
   - `host@237booking.com` — HOST role, owns the seeded properties
   - `guest@237booking.com` — GUEST role

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## What's implemented

- Homepage with a booking.com-style search bar (destination, dates, guests) and featured destinations/listings
- `/search` — filterable results (property type, max price) driven by the database
- `/property/[id]` — gallery, amenities, room types, reviews, and a review form
- `/booking/[roomId]` — booking confirmation flow (auth-gated) that creates a real `Booking` row
- `/account/bookings` — a signed-in guest's booking history
- `/host` and `/host/new` — a host dashboard for listing new properties with room types
- Credentials auth with `GUEST` / `HOST` roles (`/login`, `/signup`)

## What's not implemented yet

- Only "Stays" is wired to the database. The header's "Car rental" and "Flights" tabs (present for the booking.com look) currently show a "coming soon" placeholder — building full car/flight booking engines was out of scope for this pass.
- No payments — bookings are confirmed immediately without a payment step.
- No image upload — hosts paste image URLs; seeded properties use local placeholder graphics in `public/seed/`.
- No availability/date-conflict checking against existing bookings for the same room.

## Project structure

```
prisma/schema.prisma       Database schema (User, Property, Room, Booking, Review)
prisma/seed.ts             Sample data
src/lib/auth.ts            Auth.js configuration (credentials provider, JWT session)
src/lib/actions.ts         Server actions (signup, login, create property, create booking, review)
src/app/                   Routes (App Router)
src/components/            Shared UI components
```

# Affiliates Dashboard

A Next.js dashboard for affiliates with Clerk authentication and MongoDB storage. Built with the Tailwind UI template and themed with sky-blue, orange, and white.

## Stack

- **Next.js** (App Router)
- **Clerk** – authentication
- **MongoDB** (via Mongoose) – data storage
- **Tailwind CSS** – styling
- **Headless UI** – accessible components
- **Heroicons** – icons

## Setup

1. **Install dependencies** (already done)

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy the example env file and fill in your keys:

   ```bash
   cp .env.local.example .env.local
   ```

   - **Clerk:** Create an application at [dashboard.clerk.com](https://dashboard.clerk.com) and add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
   - **MongoDB:** Create a cluster at [cloud.mongodb.com](https://cloud.mongodb.com) and set `MONGODB_URI`.

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to sign-in if not authenticated. Use Clerk’s sign-up to create an account.

   **Note:** `npm run build` requires valid Clerk keys in `.env.local` (and optionally MongoDB for API routes that use it). Without them, the build will fail with a missing publishable key error.

## Routes

| Path        | Description                    |
| ----------- | ------------------------------ |
| `/`         | Home – dashboard (stats, activity, clients) |
| `/tools`    | Affiliate tools (links, analytics, creatives) |
| `/academy`  | Courses and certification      |
| `/support`  | Help center, chat, email       |
| `/simulators` | Commission & ROI simulators |
| `/sign-in`  | Clerk sign-in                  |
| `/sign-up`  | Clerk sign-up                  |

## Project structure

- `src/app/(dashboard)/` – Dashboard layout and pages (Home, Tools, Academy, Support, Simulators)
- `src/app/sign-in/`, `src/app/sign-up/` – Clerk auth pages
- `src/components/DashboardShell.tsx` – Header, nav, mobile menu, user button
- `src/lib/mongodb.ts` – MongoDB connection helper (use with `connectDB()` in API routes or server components)

## Logo & theme

- Logo/favicon: `public/logo.png`
- Theme: sky-blue (`sky-*`), orange (`orange-*`), and white. Primary actions use `sky-600`; accents use `orange-*` where needed.

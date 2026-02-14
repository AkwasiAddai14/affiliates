import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// When Clerk keys are missing (e.g. env not loaded), skip auth so the app doesn't 500.
// Set CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in App Hosting secrets.
const hasClerkSecret = Boolean(process.env.CLERK_SECRET_KEY?.trim())

export default hasClerkSecret
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect()
      }
    })
  : (_request: Request) => NextResponse.next()

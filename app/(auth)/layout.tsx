import "@/app/globals.css";
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'Junter',
  description: 'Empowering progress, enabling growth.'
}



export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang?: string }>
}) {
  await params
//   const selectedLocalization = localeMap[resolvedParams.lang] || nlNL;

  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // When key is missing at build time, render without ClerkProvider so prerender succeeds.
  // Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in App Hosting secrets for auth to work in production.
  if (!clerkPublishableKey) {
    return <div className="bg-dark-1 min-h-screen">{children}</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <div className="bg-dark-1 min-h-screen">
        {children}
      </div>
    </ClerkProvider>
  );
};

//  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsuanVudGVyLmV1JA';
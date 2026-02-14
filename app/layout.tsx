import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affiliates Dashboard",
  description: "Manage your affiliate leads and performance",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Avoid ClerkProvider when key is missing so static prerender (e.g. /_not-found) succeeds.
  // Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY at build time (e.g. App Hosting secrets) for auth to work.
  const body = (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      {children}
    </body>
  );

  return (
    <html lang="en">
      {publishableKey ? (
        <ClerkProvider publishableKey={publishableKey}>{body}</ClerkProvider>
      ) : (
        body
      )}
    </html>
  );
}

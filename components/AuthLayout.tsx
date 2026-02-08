import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Junter Platform"
            width={32}
            height={32}
            className="h-8 w-auto rounded-lg"
            unoptimized
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 shadow-sm ring-1 ring-slate-200/50">
            <Image
              src="/logo.png"
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
              unoptimized
            />
          </div>
          <p className="text-sm text-slate-600">
            © 2026 Junter Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

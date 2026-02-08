'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'Academy', href: '/academy' },
  { name: 'Support', href: '/support' },
  { name: 'Simulators', href: '/simulators' },
]

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-sky-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-x-6">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-3 shrink-0 p-3 md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-5 text-slate-900" />
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <Image
                src="/logo.png"
                alt="Affiliates"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-lg object-contain"
                unoptimized
              />
              <span className="hidden font-semibold text-slate-900 sm:inline">Affiliates</span>
            </Link>
          </div>
          <nav className="hidden shrink-0 md:flex md:gap-x-8 md:text-sm md:font-semibold md:text-slate-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  pathname === item.href
                    ? 'text-sky-600'
                    : 'text-slate-700 hover:text-sky-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 shrink-0 items-center justify-end gap-x-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'size-8 rounded-full ring-1 ring-slate-200',
                },
              }}
            />
          </div>
        </div>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-slate-900/10">
            <div className="-ml-0.5 flex h-16 items-center gap-x-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 p-2.5 text-slate-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
              <div className="-ml-0.5 flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Affiliates"
                  width={32}
                  height={32}
                  className="h-8 w-auto rounded-lg"
                  unoptimized
                />
                <span className="font-semibold text-slate-900">Affiliates</span>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={classNames(
                    '-mx-3 block rounded-lg px-3 py-2 text-base font-semibold',
                    pathname === item.href
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <main className="pt-4">{children}</main>
    </>
  )
}

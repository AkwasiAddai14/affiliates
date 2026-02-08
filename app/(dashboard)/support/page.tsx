import {
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  DocumentMagnifyingGlassIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

const supportChannels = [
  {
    name: 'Help center',
    description: 'Search articles, guides, and FAQs.',
    icon: DocumentMagnifyingGlassIcon,
    href: '#',
  },
  {
    name: 'Live chat',
    description: 'Chat with our support team (Mon–Fri, 9am–6pm).',
    icon: ChatBubbleLeftRightIcon,
    href: '#',
  },
  {
    name: 'Email support',
    description: 'support@affiliates.example.com — we reply within 24 hours.',
    icon: EnvelopeIcon,
    href: '#',
  },
]

export default function SupportPage() {
  return (
    <div className="relative isolate overflow-hidden pt-16 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl shrink-0 flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <LifebuoyIcon className="size-6 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Support
          </h1>
          <p className="text-slate-600">
            Get help with your account, tracking, and payouts.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {supportChannels.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/5 transition hover:border-sky-200 hover:ring-2 hover:ring-sky-200"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100">
                <channel.icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{channel.name}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">{channel.description}</p>
              <span className="mt-4 text-sm font-semibold text-sky-600 group-hover:text-sky-500">
                Go →
              </span>
            </a>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
          <h3 className="font-semibold text-slate-900">Popular articles</h3>
          <ul className="mt-4 space-y-3">
            {[
              'How do I get my affiliate link?',
              'When are commissions paid?',
              'How do I track conversions?',
              'What are the program terms?',
            ].map((title, i) => (
              <li key={i}>
                <a href="#" className="text-sm text-sky-600 hover:text-sky-500 hover:underline">
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-full left-0 -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-mt-10 sm:-ml-96 sm:translate-y-0 sm:rotate-0 sm:opacity-30"
      >
        <div
          style={{
            clipPath:
              'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
          }}
          className="aspect-1154/678 w-[288.5px] bg-linear-to-br from-sky-400 to-orange-400"
        />
      </div>
    </div>
  )
}

import {
  WrenchScrewdriverIcon,
  ChartBarIcon,
  LinkIcon,
  DocumentTextIcon,
  WrenchIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline'

const tools = [
  {
    name: 'Sales scripts',
    description: 'Ready-to-use scripts and talking points for your sales conversations.',
    icon: ChatBubbleBottomCenterTextIcon,
    href: '#',
    comingSoon: false,
  },
  {
    name: 'Link generator',
    description: 'Create and manage your affiliate tracking links.',
    icon: LinkIcon,
    href: '#',
    comingSoon: false,
  },
  {
    name: 'Performance analytics',
    description: 'Track clicks, conversions, and revenue by campaign.',
    icon: ChartBarIcon,
    href: '#',
    comingSoon: true,
  },
  {
    name: 'Creative assets',
    description: 'Download banners, landing pages, and copy for your campaigns.',
    icon: DocumentTextIcon,
    href: '#',
    comingSoon: true,
  },
  {
    name: 'API & integrations',
    description: 'Connect your tools and automate reporting.',
    icon: WrenchScrewdriverIcon,
    href: '#',
    comingSoon: true,
  },
]

export default function ToolsPage() {
  return (
    <div className="relative isolate overflow-hidden pt-16 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl shrink-0 flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <WrenchIcon className="size-6 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Affiliate tools
          </h1>
          <p className="text-lg text-slate-600">
            Everything you need to run and scale your affiliate campaigns.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/5 transition hover:ring-sky-200 hover:ring-2"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <tool.icon className="size-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{tool.description}</p>
                {tool.comingSoon ? (
                  <span className="mt-3 inline-block rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                    Coming soon
                  </span>
                ) : (
                  <a
                    href={tool.href}
                    className="mt-3 inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-500"
                  >
                    Open tool
                  </a>
                )}
              </div>
            </div>
          ))}
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

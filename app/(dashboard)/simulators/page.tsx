import {
  CalculatorIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline'

const simulators = [
  {
    name: 'Commission calculator',
    description: 'Estimate your earnings based on traffic volume and conversion rates.',
    icon: CalculatorIcon,
    href: '#',
  },
  {
    name: 'ROI simulator',
    description: 'Model different scenarios and see projected returns over time.',
    icon: ChartBarIcon,
    href: '#',
  },
  {
    name: 'Payout estimator',
    description: 'See when you can expect payouts based on your current balance.',
    icon: CurrencyDollarIcon,
    href: '#',
  },
]

const productDemos = [
  {
    name: 'Xedular web application',
    description: 'Demonstrate the Xedular web app to prospects. Full-featured browser experience.',
    icon: ComputerDesktopIcon,
    href: '#',
  },
  {
    name: 'Xedular mobile application',
    description: 'Show the Xedular mobile app. Native experience for iOS and Android.',
    icon: DevicePhoneMobileIcon,
    href: '#',
  },
  {
    name: 'Junter dashboard webapp',
    description: 'Present the Junter dashboard in the browser. Manage and track from any device.',
    icon: ComputerDesktopIcon,
    href: '#',
  },
  {
    name: 'Junter dashboard mobile app',
    description: 'Demo the Junter dashboard on mobile. On-the-go access for your clients.',
    icon: DevicePhoneMobileIcon,
    href: '#',
  },
]

export default function SimulatorsPage() {
  return (
    <div className="relative isolate overflow-hidden pt-16 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl shrink-0 flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <ChartBarSquareIcon className="size-6 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simulators
          </h1>
          <p className="text-lg text-slate-600">
            Model your affiliate performance and plan your strategy.
          </p>
        </div>

        {/* Products to demonstrate - on top */}
        <div className="mx-auto mt-10 max-w-6xl sm:mt-12">
          <h2 className="text-xl font-semibold text-slate-900">
            Products to demonstrate
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Demo these products to prospects when selling.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {productDemos.map((product) => (
              <a
                key={product.name}
                href={product.href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/5 transition hover:border-sky-200 hover:ring-2 hover:ring-sky-200"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100">
                  <product.icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{product.description}</p>
                <span className="mt-4 text-sm font-semibold text-sky-600 group-hover:text-sky-500">
                  Open demo →
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Tools section - balanced spacing */}
        <div className="mx-auto mt-16 max-w-6xl sm:mt-20">
          <h2 className="text-xl font-semibold text-slate-900">
            Tools
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Calculators and estimators for your affiliate performance.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {simulators.map((sim) => (
              <a
                key={sim.name}
                href={sim.href}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/5 transition hover:border-orange-200 hover:ring-2 hover:ring-orange-200"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100">
                  <sim.icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{sim.name}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{sim.description}</p>
                <span className="mt-4 text-sm font-semibold text-orange-600 group-hover:text-orange-500">
                  Open simulator →
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-sky-100 bg-sky-50/50 p-6 text-center">
          <p className="text-sm text-slate-600">
            Simulators use your account data where relevant. Results are estimates only and do not guarantee future earnings.
          </p>
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

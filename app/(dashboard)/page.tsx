'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import {
  PlusSmallIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import NewLeadModal from '@/components/NewLeadModal'
import {
  getDashboardStats,
  getRecentActivity,
  getRecentLeads,
  type DashboardPeriod,
  type DashboardStats,
  type RecentActivityItem,
  type RecentLeadItem,
} from '@/lib/dashboard'

const PERIODS: { name: string; value: DashboardPeriod }[] = [
  { name: 'Last 7 days', value: '7d' },
  { name: 'Last 30 days', value: '30d' },
  { name: 'All-time', value: 'all' },
]

const statuses: Record<string, string> = {
  GEWONNEN: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
  NIEUW: 'text-sky-700 bg-sky-50 ring-sky-600/20',
  CONTACT_OPGENOMEN: 'text-slate-600 bg-slate-50 ring-slate-500/10',
  OFFERTE: 'text-amber-700 bg-amber-50 ring-amber-600/20',
  VERLOREN: 'text-rose-700 bg-rose-50 ring-rose-600/10',
}

function formatChange(n: number | null): string | null {
  if (n === null) return null
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n}%`
}

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardPage() {
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false)
  const [period, setPeriod] = useState<DashboardPeriod>('7d')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([])
  const [recentLeads, setRecentLeads] = useState<RecentLeadItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(() => {
    setLoading(true)
    Promise.all([
      getDashboardStats(period),
      getRecentActivity(period, 20),
      getRecentLeads(6),
    ]).then(([s, a, l]) => {
      setStats(s ?? null)
      setRecentActivity(a)
      setRecentLeads(l)
      setLoading(false)
    })
  }, [period])

  useEffect(() => {
    loadData()
  }, [loadData])

  const statsDisplay = stats
    ? [
        { name: 'Total leads', value: stats.totalLeads.toLocaleString(), change: formatChange(stats.changeTotalLeads), changeType: (stats.changeTotalLeads ?? 0) >= 0 ? 'positive' as const : 'negative' as const },
        { name: 'Converted', value: stats.converted.toLocaleString(), change: formatChange(stats.changeConverted), changeType: (stats.changeConverted ?? 0) >= 0 ? 'positive' as const : 'negative' as const },
        { name: 'Pending', value: stats.pending.toLocaleString(), change: formatChange(stats.changePending), changeType: (stats.changePending ?? 0) >= 0 ? 'positive' as const : 'negative' as const },
        { name: 'Commission', value: `$${stats.commission.toLocaleString()}`, change: formatChange(stats.changeCommission), changeType: (stats.changeCommission ?? 0) >= 0 ? 'positive' as const : 'negative' as const },
      ]
    : []

  const activityByDate = recentActivity.reduce<Record<string, RecentActivityItem[]>>((acc, item) => {
    const key = item.dateTime
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
  const sortedDateKeys = Object.keys(activityByDate).sort((a, b) => b.localeCompare(a))

  return (
    <>
    <NewLeadModal
      key={newLeadModalOpen ? 'open' : 'closed'}
      open={newLeadModalOpen}
      onClose={() => setNewLeadModalOpen(false)}
      onSuccess={loadData}
    />
    <div className="relative isolate overflow-hidden pt-12">
      {/* Secondary navigation */}
      <header className="pt-6 pb-4 sm:pb-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-base font-semibold text-slate-900">Dashboard</h1>
          <div className="order-last flex w-full gap-x-8 text-sm font-semibold sm:order-0 sm:w-auto sm:border-l sm:border-slate-200 sm:pl-6">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={period === p.value ? 'text-sky-600' : 'text-slate-700 hover:text-sky-600'}
              >
                {p.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setNewLeadModalOpen(true)}
            className="ml-auto flex items-center gap-x-1 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <PlusSmallIcon aria-hidden="true" className="-ml-1.5 size-5" />
            New lead
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b border-slate-200 lg:border-t lg:border-t-slate-100">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          {loading ? (
            <div className="col-span-full flex items-center justify-center border-t border-slate-200 px-4 py-12 text-slate-500">
              Loading…
            </div>
          ) : (
            statsDisplay.map((stat, statIdx) => (
              <div
                key={stat.name}
                className={classNames(
                  statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                  'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-slate-200 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8'
                )}
              >
                <dt className="text-sm font-medium text-slate-500">{stat.name}</dt>
                <dd
                  className={classNames(
                    stat.changeType === 'negative' ? 'text-rose-600' : 'text-slate-600',
                    'text-xs font-medium'
                  )}
                >
                  {stat.change ?? '—'}
                </dd>
                <dd className="w-full flex-none text-3xl font-semibold tracking-tight text-slate-900">
                  {stat.value}
                </dd>
              </div>
            ))
          )}
        </dl>
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

    <div className="space-y-16 py-16 xl:space-y-20">
      {/* Recent activity table */}
      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mx-auto max-w-2xl text-base font-semibold text-slate-900 lg:mx-0 lg:max-w-none">
            Recent activity
          </h2>
        </div>
        <div className="mt-6 overflow-hidden border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <table className="w-full text-left">
                <thead className="sr-only">
                  <tr>
                    <th>Activity</th>
                    <th className="hidden sm:table-cell">Company</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDateKeys.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-sm text-slate-500">
                        No recent activity
                      </td>
                    </tr>
                  ) : (
                    sortedDateKeys.map((dateKey) => {
                      const dayLabel = activityByDate[dateKey][0]?.date ?? dateKey
                      return (
                        <Fragment key={dateKey}>
                          <tr className="text-sm text-slate-900">
                            <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                              <time dateTime={dateKey}>{dayLabel}</time>
                              <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-slate-200 bg-slate-50" />
                              <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-slate-200 bg-slate-50" />
                            </th>
                          </tr>
                          {activityByDate[dateKey].map((item) => (
                            <tr key={item.id}>
                              <td className="relative py-5 pr-6">
                                <div className="flex gap-x-6">
                                  <ArrowUpCircleIcon
                                    aria-hidden="true"
                                    className="hidden size-5 flex-none text-slate-400 sm:block"
                                  />
                                  <div className="flex-auto">
                                    <div className="text-sm font-medium text-slate-900">{item.description}</div>
                                    <div className="mt-0.5 text-xs text-slate-500">{item.type}</div>
                                  </div>
                                </div>
                                <div className="absolute right-full bottom-0 h-px w-screen bg-slate-100" />
                                <div className="absolute bottom-0 left-0 h-px w-screen bg-slate-100" />
                              </td>
                              <td className="hidden py-5 pr-6 sm:table-cell">
                                <div className="text-sm text-slate-900">{item.companyName ?? '—'}</div>
                              </td>
                              <td className="py-5 text-right">
                                {item.leadId ? (
                                  <a
                                    href={`#lead-${item.leadId}`}
                                    className="text-sm font-medium text-sky-600 hover:text-sky-500"
                                  >
                                    View<span className="hidden sm:inline"> lead</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Recent client list */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent clients</h2>
            <a href="#" className="text-sm font-semibold text-sky-600 hover:text-sky-500">
              View all<span className="sr-only">, clients</span>
            </a>
          </div>
          <ul role="list" className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
            {recentLeads.length === 0 ? (
              <li className="col-span-full py-8 text-center text-sm text-slate-500">No recent leads</li>
            ) : (
              recentLeads.map((lead) => (
                <li key={lead.id} className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex items-center gap-x-4 border-b border-slate-200 bg-slate-50 p-6">
                    <div className="flex size-12 flex-none items-center justify-center rounded-lg bg-sky-100 text-lg font-semibold text-sky-700">
                      {lead.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                    <Menu as="div" className="relative ml-auto">
                      <MenuButton className="relative block text-slate-400 hover:text-slate-500">
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
                      </MenuButton>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        <MenuItem>
                          <a
                            href={`#lead-${lead.id}`}
                            className="block px-3 py-1 text-sm text-slate-900 data-focus:bg-slate-50 data-focus:outline-none"
                          >
                            View<span className="sr-only">, {lead.name}</span>
                          </a>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                  <dl className="-my-3 divide-y divide-slate-100 px-6 py-4 text-sm">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-slate-500">Added</dt>
                      <dd className="text-slate-700">
                        <time dateTime={lead.lastLead.dateTime}>{lead.lastLead.date}</time>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-slate-500">Status</dt>
                      <dd className="flex items-start gap-x-2">
                        <div
                          className={classNames(
                            statuses[lead.lastLead.status] ?? 'text-slate-600 bg-slate-50 ring-slate-500/10',
                            'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                          )}
                        >
                          {lead.lastLead.status}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
    </>
  )
}

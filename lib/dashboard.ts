'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import AccountManager from '@/lib/models/accountmanager.model'
import Lead from '@/lib/models/lead.model'

export type DashboardPeriod = '7d' | '30d' | 'all'

export type DashboardStats = {
  totalLeads: number
  converted: number
  pending: number
  commission: number
  changeTotalLeads: number | null
  changeConverted: number | null
  changePending: number | null
  changeCommission: number | null
}

export type RecentActivityItem = {
  id: string
  date: string
  dateTime: string
  type: string
  description: string
  companyName?: string
  leadId?: string
}

export type RecentLeadItem = {
  id: string
  name: string
  companyName: string
  lastLead: {
    date: string
    dateTime: string
    status: string
    companyName: string
  }
}

function getDateRange(period: DashboardPeriod): { start: Date; prevStart: Date; prevEnd: Date } | null {
  const now = new Date()
  now.setHours(23, 59, 59, 999)
  if (period === '7d') {
    const start = new Date(now)
    start.setDate(start.getDate() - 7)
    start.setHours(0, 0, 0, 0)
    const prevEnd = new Date(start)
    prevEnd.setMilliseconds(-1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevStart.getDate() - 7)
    return { start, prevStart, prevEnd }
  }
  if (period === '30d') {
    const start = new Date(now)
    start.setDate(start.getDate() - 30)
    start.setHours(0, 0, 0, 0)
    const prevEnd = new Date(start)
    prevEnd.setMilliseconds(-1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevStart.getDate() - 30)
    return { start, prevStart, prevEnd }
  }
  return null
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export async function getDashboardStats(period: DashboardPeriod): Promise<DashboardStats | null> {
  const { userId } = await auth()
  if (!userId) return null
  try {
    await connectDB()
    const accountManager = await AccountManager.findOne({ clerkId: userId }).lean()
    if (!accountManager) return null

    const amId = accountManager._id
    const range = getDateRange(period)

    const baseFilter = range ? { accountManager: amId, createdAt: { $gte: range.start } } : { accountManager: amId }

    const [totalLeads, converted, pending] = await Promise.all([
      Lead.countDocuments(baseFilter),
      Lead.countDocuments({ ...baseFilter, status: 'GEWONNEN' }),
      Lead.countDocuments({
        ...baseFilter,
        status: { $in: ['NIEUW', 'CONTACT_OPGENOMEN', 'OFFERTE'] },
      }),
    ])

    const commission = period === 'all' 
      ? (accountManager.commissionTotal ?? 0) 
      : (accountManager.commissionTotal ?? 0)

    let changeTotalLeads: number | null = null
    let changeConverted: number | null = null
    let changePending: number | null = null
    let changeCommission: number | null = null

    if (range) {
      const prevFilter = { accountManager: amId, createdAt: { $gte: range.prevStart, $lte: range.prevEnd } }
      const [prevTotal, prevConverted, prevPending] = await Promise.all([
        Lead.countDocuments(prevFilter),
        Lead.countDocuments({ ...prevFilter, status: 'GEWONNEN' }),
        Lead.countDocuments({ ...prevFilter, status: { $in: ['NIEUW', 'CONTACT_OPGENOMEN', 'OFFERTE'] } }),
      ])
      changeTotalLeads = percentChange(totalLeads, prevTotal)
      changeConverted = percentChange(converted, prevConverted)
      changePending = percentChange(pending, prevPending)
    }

    return {
      totalLeads,
      converted,
      pending,
      commission,
      changeTotalLeads,
      changeConverted,
      changePending,
      changeCommission,
    }
  } catch (err) {
    console.error('getDashboardStats error:', err)
    return null
  }
}

export async function getRecentActivity(
  period: DashboardPeriod = '7d',
  limit = 20
): Promise<RecentActivityItem[]> {
  const { userId } = await auth()
  if (!userId) return []
  try {
    await connectDB()
    const accountManager = await AccountManager.findOne({ clerkId: userId })
      .select('activities _id')
      .lean()
    if (!accountManager) return []

    const amId = accountManager._id
    const hasActivities = Array.isArray(accountManager.activities) && accountManager.activities.length > 0

    if (!hasActivities) {
      const range = getDateRange(period)
      const leadFilter = range
        ? { accountManager: amId, createdAt: { $gte: range.start } }
        : { accountManager: amId }
      const leads = await Lead.find(leadFilter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
      return leads.map((l) => ({
        id: l._id.toString(),
        date: formatRelativeDate(l.createdAt),
        dateTime: new Date(l.createdAt).toISOString().slice(0, 10),
        type: 'LEAD_CREATED',
        description: `Lead: ${l.companyName}`,
        companyName: l.companyName,
        leadId: l._id.toString(),
      }))
    }

    const activities = (accountManager.activities as Array<{ type: string; description: string; metadata?: { companyName?: string; leadId?: string }; createdAt: Date }>)
      .slice(0, limit)
      .map((a, i) => ({
        id: (a as { _id?: string })._id?.toString() ?? a.metadata?.leadId ?? `act-${i}`,
        date: formatRelativeDate(a.createdAt),
        dateTime: new Date(a.createdAt).toISOString().slice(0, 10),
        type: a.type,
        description: a.description,
        companyName: a.metadata?.companyName,
        leadId: a.metadata?.leadId as string | undefined,
      }))
    return activities
  } catch (err) {
    console.error('getRecentActivity error:', err)
    return []
  }
}

export async function getRecentLeads(limit = 6): Promise<RecentLeadItem[]> {
  const { userId } = await auth()
  if (!userId) return []
  try {
    await connectDB()
    const accountManager = await AccountManager.findOne({ clerkId: userId }).lean()
    if (!accountManager) return []
    const leads = await Lead.find({ accountManager: accountManager._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    return leads.map((l) => ({
      id: l._id.toString(),
      name: l.companyName,
      companyName: l.companyName,
      lastLead: {
        date: formatDate(l.createdAt),
        dateTime: new Date(l.createdAt).toISOString().slice(0, 10),
        status: l.status,
        companyName: l.companyName,
      },
    }))
  } catch (err) {
    console.error('getRecentLeads error:', err)
    return []
  }
}

function formatRelativeDate(d: Date): string {
  const date = new Date(d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  date.setHours(0, 0, 0, 0)
  if (date.getTime() === today.getTime()) return 'Today'
  if (date.getTime() === yesterday.getTime()) return 'Yesterday'
  return date.toLocaleDateString('en-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('en-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

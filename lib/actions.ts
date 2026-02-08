'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/mongodb'
import AccountManager from '@/lib/models/accountmanager.model'
import Lead from '@/lib/models/lead.model'
import { createLeadValidation, type CreateLeadInput } from '@/lib/validations/lead'

export type CreateLeadState = {
  success?: boolean
  error?: string
  fieldErrors?: Partial<Record<keyof CreateLeadInput, string>>
}

export async function createLead(
  _prevState: CreateLeadState | null,
  formData: FormData
): Promise<CreateLeadState> {
  const raw = {
    companyName: formData.get('companyName') as string,
    kvkNumber: (formData.get('kvkNumber') as string)?.trim() || undefined,
    contactPersonFirstname: formData.get('contactPersonFirstname') as string,
    contactPersonLastname: formData.get('contactPersonLastname') as string,
    contactEmail: formData.get('contactEmail') as string,
    contactPhone: formData.get('contactPhone') as string,
    notes: (formData.get('notes') as string)?.trim() || undefined,
  }

  const { userId } = await auth()
  if (!userId) {
    return { error: 'Je moet ingelogd zijn om een lead aan te maken.' }
  }

  try {
    await connectDB()
    const accountManager = await AccountManager.findOne({ clerkId: userId })
    if (!accountManager) {
      return { error: 'Geen account manager gevonden. Voltooi eerst je profiel.' }
    }

    const parsed = createLeadValidation.safeParse({
      ...raw,
      accountManagerId: accountManager._id.toString(),
      status: 'NIEUW',
    })

    if (!parsed.success) {
      const fieldErrors: CreateLeadState['fieldErrors'] = {}
      parsed.error.flatten().fieldErrors &&
        Object.entries(parsed.error.flatten().fieldErrors).forEach(([k, v]) => {
          fieldErrors[k as keyof CreateLeadInput] = Array.isArray(v) ? v[0] : v
        })
      return { error: 'Controleer de velden.', fieldErrors }
    }

    const lead = await Lead.create({
      accountManager: accountManager._id,
      companyName: parsed.data.companyName,
      kvkNumber: parsed.data.kvkNumber,
      contactPersonFirstname: parsed.data.contactPersonFirstname,
      contactPersonLastname: parsed.data.contactPersonLastname,
      contactEmail: parsed.data.contactEmail,
      contactPhone: parsed.data.contactPhone,
      notes: parsed.data.notes,
      status: parsed.data.status ?? 'NIEUW',
    })

    // Update account manager: add lead to leads array and log activity
    const activity = {
      type: 'LEAD_CREATED',
      description: `Lead aangemaakt: ${parsed.data.companyName}`,
      metadata: { leadId: lead._id.toString(), companyName: parsed.data.companyName },
      createdAt: new Date(),
    }
    await AccountManager.findByIdAndUpdate(accountManager._id, {
      $push: {
        leads: lead._id,
        activities: { $each: [activity], $position: 0, $slice: 200 },
      },
    })

    return { success: true }
  } catch (err) {
    console.error('createLead error:', err)
    return {
      error: err instanceof Error ? err.message : 'Er is iets misgegaan.',
    }
  }
}

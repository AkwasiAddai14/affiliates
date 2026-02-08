'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { createLead, type CreateLeadState } from '@/lib/actions'

const fieldLabels: Record<string, string> = {
  companyName: 'Bedrijfsnaam',
  kvkNumber: 'KVK-nummer (8 cijfers)',
  contactPersonFirstname: 'Voornaam contactpersoon',
  contactPersonLastname: 'Achternaam contactpersoon',
  contactEmail: 'E-mailadres',
  contactPhone: 'Telefoonnummer',
  notes: 'Notities',
}

type KvkData = {
  companyName: string
  streetName: string
  houseNumber: string
  houseNumberAddition: string
  houseLetter: string
  postalCode: string
  place: string
}

export default function NewLeadModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [state, formAction, isPending] = useActionState<CreateLeadState | null, FormData>(
    createLead,
    null
  )
  const [kvkLoading, setKvkLoading] = useState(false)
  const [kvkError, setKvkError] = useState<string | null>(null)
  const [kvkData, setKvkData] = useState<KvkData | null>(null)
  const kvkInputRef = useRef<HTMLInputElement>(null)
  const companyNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.success) {
      onSuccess?.()
      onClose()
    }
  }, [state?.success, onClose, onSuccess])

  useEffect(() => {
    if (open) {
      setKvkError(null)
      setKvkData(null)
    }
  }, [open])

  async function handleKvkLookup() {
    const kvk = kvkInputRef.current?.value?.replace(/\D/g, '') ?? ''
    if (kvk.length !== 8) {
      setKvkError('Voer een geldig KVK-nummer in (8 cijfers).')
      setKvkData(null)
      return
    }
    setKvkError(null)
    setKvkData(null)
    setKvkLoading(true)
    try {
      const res = await fetch(`/api/kvk?kvkNummer=${encodeURIComponent(kvk)}`)
      const data = await res.json()
      if (!res.ok) {
        setKvkError(data.error ?? 'Geen gegevens gevonden voor dit KVK-nummer.')
        return
      }
      setKvkData(data)
      if (companyNameInputRef.current && data.companyName) {
        companyNameInputRef.current.value = data.companyName
      }
    } catch {
      setKvkError('Kon KVK-gegevens niet ophalen.')
    } finally {
      setKvkLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-900/10">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Nieuwe lead
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>

          <form action={formAction} className="mt-4 space-y-4">
            {state?.error && (
              <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="companyName" className="mb-1 block text-sm font-medium text-slate-700">
                {fieldLabels.companyName} *
              </label>
              <input
                ref={companyNameInputRef}
                id="companyName"
                name="companyName"
                type="text"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-invalid={!!state?.fieldErrors?.companyName}
                aria-describedby={state?.fieldErrors?.companyName ? 'companyName-error' : undefined}
              />
              {state?.fieldErrors?.companyName && (
                <p id="companyName-error" className="mt-1 text-sm text-rose-600">
                  {state.fieldErrors.companyName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="kvkNumber" className="mb-1 block text-sm font-medium text-slate-700">
                {fieldLabels.kvkNumber}
              </label>
              <div className="flex gap-2">
                <input
                  ref={kvkInputRef}
                  id="kvkNumber"
                  name="kvkNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="12345678"
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  aria-invalid={!!state?.fieldErrors?.kvkNumber}
                  disabled={kvkLoading}
                />
                <button
                  type="button"
                  onClick={handleKvkLookup}
                  disabled={kvkLoading}
                  title="KVK-gegevens ophalen"
                  className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
                >
                  {kvkLoading ? (
                    <span className="text-slate-500">...</span>
                  ) : (
                    <>
                      <span className="sr-only">KVK-gegevens ophalen</span>
                      <MagnifyingGlassIcon className="size-5 text-slate-600" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
              {state?.fieldErrors?.kvkNumber && (
                <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.kvkNumber}</p>
              )}
              {kvkError && (
                <p className="mt-1 text-sm text-rose-600">{kvkError}</p>
              )}
              {kvkData && (
                <div className="mt-2 rounded-lg border border-sky-200 bg-sky-50/50 p-3 text-sm text-slate-700">
                  <p className="font-medium text-sky-800">Gegevens uit KVK</p>
                  <p className="mt-0.5 font-medium text-slate-900">{kvkData.companyName}</p>
                  {(kvkData.streetName || kvkData.postalCode || kvkData.place) && (
                    <p className="mt-1 text-slate-600">
                      {[
                        [kvkData.streetName, kvkData.houseNumber, kvkData.houseNumberAddition, kvkData.houseLetter].filter(Boolean).join(' '),
                        [kvkData.postalCode, kvkData.place].filter(Boolean).join(' '),
                      ].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactPersonFirstname" className="mb-1 block text-sm font-medium text-slate-700">
                  {fieldLabels.contactPersonFirstname} *
                </label>
                <input
                  id="contactPersonFirstname"
                  name="contactPersonFirstname"
                  type="text"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  aria-invalid={!!state?.fieldErrors?.contactPersonFirstname}
                />
                {state?.fieldErrors?.contactPersonFirstname && (
                  <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.contactPersonFirstname}</p>
                )}
              </div>
              <div>
                <label htmlFor="contactPersonLastname" className="mb-1 block text-sm font-medium text-slate-700">
                  {fieldLabels.contactPersonLastname} *
                </label>
                <input
                  id="contactPersonLastname"
                  name="contactPersonLastname"
                  type="text"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  aria-invalid={!!state?.fieldErrors?.contactPersonLastname}
                />
                {state?.fieldErrors?.contactPersonLastname && (
                  <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.contactPersonLastname}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-slate-700">
                {fieldLabels.contactEmail} *
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-invalid={!!state?.fieldErrors?.contactEmail}
              />
              {state?.fieldErrors?.contactEmail && (
                <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.contactEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium text-slate-700">
                {fieldLabels.contactPhone} *
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-invalid={!!state?.fieldErrors?.contactPhone}
              />
              {state?.fieldErrors?.contactPhone && (
                <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.contactPhone}</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
                {fieldLabels.notes}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50"
              >
                {isPending ? 'Bezig…' : 'Lead aanmaken'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

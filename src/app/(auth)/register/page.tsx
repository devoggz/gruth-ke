'use client'
// src/app/(auth)/register/page.tsx
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import type { E164Number } from 'libphonenumber-js'
import 'react-phone-number-input/style.css'
import Select from 'react-select'
import countryList from 'react-select-country-list'

// ─── Shared react-select styles — pixel-matched to .input-field ───────────────
// Identical factory to the one in request-verification/page.tsx
function buildSelectStyles(hasError = false) {
  return {
    control: (b: any, s: any) => ({
      ...b,
      minHeight: '46px',
      borderRadius: '0.5rem',
      fontSize: '14px',
      fontFamily: "var(--font-body,'DM Sans',system-ui,sans-serif)",
      background: '#fff',
      border: `1px solid ${s.isFocused ? 'transparent' : hasError ? '#fca5a5' : '#e5e7eb'}`,
      boxShadow: s.isFocused
          ? hasError ? '0 0 0 2px rgba(239,68,68,0.4)' : '0 0 0 2px rgba(249,115,22,0.5)'
          : 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': { borderColor: s.isFocused ? 'transparent' : '#d3d2cf' },
    }),
    valueContainer: (b: any) => ({ ...b, padding: '0 12px', gap: '4px' }),
    singleValue:    (b: any) => ({
      ...b, color: '#3d3b36',
      fontFamily: "var(--font-body,'DM Sans',system-ui,sans-serif)", fontSize: '14px',
    }),
    placeholder: (b: any) => ({
      ...b, color: '#9ca3af',
      fontFamily: "var(--font-body,'DM Sans',system-ui,sans-serif)", fontSize: '14px',
    }),
    input: (b: any) => ({
      ...b, color: '#3d3b36', margin: 0, padding: 0,
      fontFamily: "var(--font-body,'DM Sans',system-ui,sans-serif)", fontSize: '14px',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (b: any, s: any) => ({
      ...b,
      color: s.isFocused ? '#f97316' : '#9ca3af',
      padding: '0 10px 0 0',
      transition: 'color 0.15s, transform 0.2s',
      transform: s.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': { color: '#f97316' },
    }),
    clearIndicator: (b: any) => ({
      ...b, color: '#9ca3af', padding: '0 6px 0 0',
      '&:hover': { color: '#f97316' },
    }),
    menu: (b: any) => ({
      ...b,
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 40px rgba(0,0,0,0.10)',
      background: '#fff',
      marginTop: '6px',
      zIndex: 60,
      overflow: 'hidden',
      fontFamily: "var(--font-body,'DM Sans',system-ui,sans-serif)",
    }),
    menuList:  (b: any) => ({ ...b, padding: '4px', maxHeight: '220px' }),
    option: (b: any, s: any) => ({
      ...b,
      borderRadius: '0.5rem', fontSize: '14px', padding: '9px 12px', cursor: 'pointer',
      fontFamily: "var(--font-body,'DM Sans',system-ui,sans-serif)",
      background: s.isSelected ? '#f97316' : s.isFocused ? '#fff7ed' : 'transparent',
      color: s.isSelected ? '#fff' : s.isFocused ? '#c2570d' : '#3d3b36',
      '&:active': { background: '#fed7aa' },
    }),
    noOptionsMessage: (b: any) => ({ ...b, fontSize: '13px', color: '#9ca3af' }),
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const countryOptions          = useMemo(() => countryList().getData(), [])

  const [form, setForm] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
    phone:           '' as E164Number | '',
    countryOption:   null as { label: string; value: string } | null,
    country:         '',
  })

  const set = (f: string, v: any) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.phone && !isValidPhoneNumber(form.phone as string)) {
      setError('Please enter a valid phone number.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          password: form.password,
          country: form.country,
          phone:   form.phone,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return }
      router.push('/verify-email')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="w-full max-w-md">
        {/* Phone input — scoped CSS identical to request-verification form */}
        <style>{`
        .rpi-wrapper .PhoneInput {
          display: flex; align-items: center; width: 100%;
          padding: 0 14px; height: 46px;
          border: 1px solid #e5e7eb; border-radius: 0.5rem;
          background: #ffffff;
          font-family: var(--font-body,'DM Sans',system-ui,sans-serif);
          font-size: 14px; color: #3d3b36;
          transition: all 0.15s ease; gap: 10px; cursor: text;
        }
        .rpi-wrapper .PhoneInput:focus-within {
          border-color: transparent;
          box-shadow: 0 0 0 2px rgba(249,115,22,0.5);
          outline: none;
        }
        .rpi-wrapper .PhoneInputCountry {
          display: flex; align-items: center; gap: 6px;
          flex-shrink: 0; padding-right: 10px;
          border-right: 1px solid #e5e7eb;
          position: relative; cursor: pointer;
        }
        .rpi-wrapper .PhoneInputCountryFlag {
          width: 20px; height: 14px;
          border-radius: 2px; overflow: hidden;
        }
        .rpi-wrapper .PhoneInputCountrySelect {
          position: absolute; inset: 0;
          opacity: 0; cursor: pointer; z-index: 2;
        }
        .rpi-wrapper .PhoneInputCountrySelectArrow {
          width: 5px; height: 5px;
          border-right: 1.5px solid #9ca3af;
          border-bottom: 1.5px solid #9ca3af;
          transform: rotate(45deg) translateY(-2px);
          transition: border-color 0.15s; margin-left: 2px;
        }
        .rpi-wrapper .PhoneInput:focus-within .PhoneInputCountrySelectArrow {
          border-color: #f97316;
        }
        .rpi-wrapper .PhoneInputInput {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: var(--font-body,'DM Sans',system-ui,sans-serif);
          font-size: 14px; color: #3d3b36; padding: 0; min-width: 0;
        }
        .rpi-wrapper .PhoneInputInput::placeholder { color: #9ca3af; }
      `}</style>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-charcoal-950 mb-1">Create account</h1>
            <p className="text-charcoal-500 text-sm">Start monitoring your projects</p>
          </div>

          {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-sm text-red-700 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <input type="text" required value={form.name}
                     onChange={e => set('name', e.target.value)}
                     className="input-field" placeholder="James Mwangi"/>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input type="email" required value={form.email}
                     onChange={e => set('email', e.target.value)}
                     className="input-field" placeholder="james@example.com"/>
            </div>

            {/* Password pair */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Password</label>
                <input type="password" required minLength={8} value={form.password}
                       onChange={e => set('password', e.target.value)}
                       className="input-field" placeholder="••••••••"/>
              </div>
              <div>
                <label className="label">Confirm</label>
                <input type="password" required value={form.confirmPassword}
                       onChange={e => set('confirmPassword', e.target.value)}
                       className="input-field" placeholder="••••••••"/>
              </div>
            </div>

            {/* Country — react-select, same styles as verification form */}
            <div>
              <label className="label">Country of Residence</label>
              <Select
                  instanceId="register-country"
                  options={countryOptions}
                  value={form.countryOption}
                  onChange={opt => { set('countryOption', opt ?? null); set('country', opt?.label ?? '') }}
                  placeholder="Search your country…"
                  isSearchable
                  isClearable
                  styles={buildSelectStyles(false)}
                  noOptionsMessage={() => 'No country found'}
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                  menuPosition="fixed"
              />
            </div>

            {/* Phone — styled PhoneInput, same as verification form */}
            <div>
              <label className="label">Phone / WhatsApp <span className="font-normal text-charcoal-400 text-xs">optional</span></label>
              <div className="rpi-wrapper">
                <PhoneInput
                    international
                    defaultCountry="GB"
                    countryCallingCodeEditable={false}
                    value={form.phone as E164Number}
                    onChange={val => set('phone', val ?? '')}
                    placeholder="Enter phone number"
                />
              </div>
              <p className="text-xs text-charcoal-400 mt-1.5">Used for WhatsApp project updates</p>
            </div>

            <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                  <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="20 60"/>
                </svg>
                Creating account…
              </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
  )
}
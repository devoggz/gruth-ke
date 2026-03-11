'use client'
// src/app/(auth)/login/page.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail]       = useState('demo@groundtruth.ke')
  const [password, setPassword] = useState('demo1234')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent]       = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setUnverifiedEmail(null)

    const result = await signIn('credentials', { email, password, redirect: false })

    setLoading(false)

    if (result?.error) {
      // NextAuth wraps thrown errors — check for our specific code
      if (result.error.includes('EMAIL_NOT_VERIFIED')) {
        setUnverifiedEmail(email)
        setError('Please verify your email address before signing in.')
      } else {
        setError('Invalid email or password.')
      }
      return
    }

    const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
    router.push(callbackUrl)
    router.refresh()
  }

  const handleResend = async () => {
    if (!unverifiedEmail) return
    setResendLoading(true)
    try {
      await fetch('/api/auth/resend-verification', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: unverifiedEmail }),
      })
      setResendSent(true)
    } catch {
      // silent — resend endpoint always returns 200
    } finally {
      setResendLoading(false)
    }
  }

  return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-charcoal-950 mb-1">Sign in</h1>
            <p className="text-charcoal-500 text-sm">Access your project dashboard</p>
          </div>

          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs text-blue-700">
            <strong>Demo:</strong> demo@groundtruth.ke / demo1234
          </div>

          {/* Error state */}
          {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 text-sm text-red-700">
                <p className="font-medium mb-1">{error}</p>

                {/* Unverified — show resend option */}
                {unverifiedEmail && (
                    resendSent ? (
                        <p className="text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mt-2 text-xs">
                          ✓ Verification email sent — check your inbox.
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="mt-2 text-xs text-orange-600 font-medium hover:text-orange-700 underline underline-offset-2 transition-colors disabled:opacity-60"
                        >
                          {resendLoading ? 'Sending…' : 'Resend verification email →'}
                        </button>
                    )
                )}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="label">Email</label>
              <input type="email" required value={email}
                     onChange={e => setEmail(e.target.value)}
                     className="input-field" placeholder="you@example.com"/>
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="input-field" placeholder="••••••••"/>
            </div>
            <button type="submit" disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="20 60"/>
                </svg>
                Signing in…
              </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
  )
}

export default function LoginPage() {
  return (
      <Suspense fallback={<div />}>
        <LoginForm />
      </Suspense>
  )
}
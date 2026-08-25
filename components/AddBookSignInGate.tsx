'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { Lock, Upload } from 'lucide-react'

const AddBookSignInGate = () => {
    const clerk = useClerk()
    const hasAutoOpenedRef = useRef(false)

    useEffect(() => {
        if (hasAutoOpenedRef.current) return
        hasAutoOpenedRef.current = true
        clerk.openSignIn({ forceRedirectUrl: '/books/new' })
    }, [clerk])

    return (
        <div className="signin-gate">
            <div className="relative">
                <span
                    className="flex size-20 items-center justify-center rounded-3xl bg-[var(--accent-glow)] text-[var(--accent-deep)] ring-1 ring-[var(--accent-warm)]/25"
                    aria-hidden="true"
                >
                    <Upload className="size-9" />
                </span>
                <span className="signin-gate-lock" aria-hidden="true">
                    <Lock className="w-4 h-4" />
                </span>
            </div>

            <h1 className="font-serif text-xl font-semibold text-[var(--text-primary)] text-center mt-6">
                Sign in to add a book
            </h1>

            <p className="signin-gate-message">
                Create a free account or sign in to upload your first PDF — ask it questions,
                get summaries, or listen while it&apos;s read aloud.
            </p>

            <button
                type="button"
                onClick={() => clerk.openSignIn({ forceRedirectUrl: '/books/new' })}
                className="hero-cta"
            >
                Sign in to continue
            </button>

            <p className="text-xs text-[var(--text-muted)]">
                Free plan includes 1 book ·{' '}
                <Link href="/" className="underline underline-offset-2 hover:text-[var(--text-secondary)]">
                    Back to library
                </Link>
            </p>
        </div>
    )
}

export default AddBookSignInGate

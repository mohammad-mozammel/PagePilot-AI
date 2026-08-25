'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useClerk } from '@clerk/nextjs'
import { Lock } from 'lucide-react'

interface BookSignInGateProps {
    title: string
    author: string
    coverURL: string
    redirectUrl: string
}

const BookSignInGate = ({ title, author, coverURL, redirectUrl }: BookSignInGateProps) => {
    const clerk = useClerk()
    const hasAutoOpenedRef = useRef(false)

    useEffect(() => {
        if (hasAutoOpenedRef.current) return
        hasAutoOpenedRef.current = true
        clerk.openSignIn({ forceRedirectUrl: redirectUrl })
    }, [clerk, redirectUrl])

    return (
        <div className="signin-gate">
            <div className="signin-gate-cover">
                <Image
                    src={coverURL}
                    alt={`Cover of ${title} by ${author}`}
                    width={140}
                    height={196}
                    className="w-[140px] h-[196px] object-cover rounded-lg"
                    style={{ boxShadow: 'var(--shadow-book)' }}
                    priority
                />
                <div className="signin-gate-lock" aria-hidden="true">
                    <Lock className="w-4 h-4" />
                </div>
            </div>

            <h1 className="font-serif text-xl font-semibold text-[var(--text-primary)] text-center mt-6">
                {title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] text-center mt-0.5">{author}</p>

            <p className="signin-gate-message">
                Sign in to start your voice conversation with this book.
            </p>

            <button
                type="button"
                onClick={() => clerk.openSignIn({ forceRedirectUrl: redirectUrl })}
                className="hero-cta"
            >
                Sign in to continue
            </button>
            <p className="text-xs text-[var(--text-muted)]">Your library stays synced across devices.</p>
        </div>
    )
}

export default BookSignInGate

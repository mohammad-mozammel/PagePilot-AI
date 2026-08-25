'use client'

import Link from 'next/link'
import { BookCardProps } from '@/types'
import Image from 'next/image'
import { Headphones } from 'lucide-react'

// Deterministic bar config so server and client render identically.
const CARD_EQ_BARS = [
    { h: 45, d: '-0.85s', dur: '1.05s' },
    { h: 90, d: '-0.4s', dur: '1.25s' },
    { h: 60, d: '-1.05s', dur: '0.95s' },
    { h: 100, d: '-0.3s', dur: '1.35s' },
    { h: 50, d: '-0.7s', dur: '1.15s' },
]

const FEAT_EQ_BARS = [
    { h: 55, d: '-0.9s', dur: '1.08s' },
    { h: 95, d: '-0.45s', dur: '1.2s' },
    { h: 65, d: '-1.05s', dur: '0.98s' },
]

const BookCard = ({ title, author, coverURL, slug, persona, variant = 'grid' }: BookCardProps) => {
    const fallbackSrc = '/assets/book-cover.svg'

    /* Featured — horizontal "continue listening" card */
    if (variant === 'featured') {
        return (
            <Link
                href={`/books/${slug}`}
                className="book-card group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] rounded-2xl"
                aria-label={`Continue with ${title} by ${author}`}
            >
                <article className="feat-card">
                    <div className="feat-cover">
                        <Image
                            src={coverURL}
                            alt={`Cover of ${title} by ${author}`}
                            fill
                            sizes="160px"
                            className="object-cover"
                            onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement
                                if (!target.src.endsWith(fallbackSrc)) {
                                    target.src = fallbackSrc
                                }
                            }}
                        />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <p className="feat-kicker">
                            Continue
                            <span className="eq-mini" aria-hidden="true">
                                {FEAT_EQ_BARS.map((bar, i) => (
                                    <span
                                        key={i}
                                        style={{ height: `${bar.h}%`, animationDelay: bar.d, animationDuration: bar.dur }}
                                    />
                                ))}
                            </span>
                        </p>
                        <h3 className="feat-title mt-1">{title}</h3>
                        <p className="feat-author mt-0.5">{author}</p>
                        <span className="feat-voice">
                            <Headphones className="size-3" aria-hidden="true" />
                            Voice · {persona || 'Rachel'}
                        </span>
                    </div>
                </article>
            </Link>
        )
    }

    const isShelf = variant === 'shelf'

    return (
        <Link
            href={`/books/${slug}`}
            className="book-card group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] rounded-xl"
            aria-label={`Open ${title} by ${author}`}
        >
            <article className="relative flex flex-col h-full">
                <div className="book-card-stage">
                    <div className="book-card-3d">
                        <div className="book-card-spine" aria-hidden="true" />

                        <div
                            className={
                                isShelf
                                    ? 'book-card-cover-wrapper book-card-cover-wrapper--shelf'
                                    : 'book-card-cover-wrapper'
                            }
                        >
                            <Image
                                src={coverURL}
                                alt={`Cover of ${title} by ${author}`}
                                width={133}
                                height={200}
                                className="book-card-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                                loading="lazy"
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement
                                    if (!target.src.endsWith(fallbackSrc)) {
                                        target.src = fallbackSrc
                                    }
                                }}
                            />

                            <div className="book-card-shade" aria-hidden="true" />

                            {!isShelf && (
                                <>
                                    <span className="book-card-listen-chip" aria-hidden="true">
                                        <Headphones className="w-4 h-4 text-[var(--accent-deep)]" />
                                        <span className="text-xs font-semibold text-[var(--text-primary)]">Listen</span>
                                    </span>
                                    <span className="book-card-eq" aria-hidden="true">
                                        {CARD_EQ_BARS.map((bar, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    height: `${bar.h}%`,
                                                    animationDelay: bar.d,
                                                    animationDuration: bar.dur,
                                                }}
                                            />
                                        ))}
                                    </span>
                                </>
                            )}
                        </div>

                        {isShelf && <div className="book-card-shelf-ledge" aria-hidden="true" />}
                    </div>
                </div>

                <div className="book-card-meta">
                    <h3
                        className={
                            isShelf ? 'book-card-title book-card-title--shelf' : 'book-card-title'
                        }
                    >
                        {title}
                    </h3>
                    <p
                        className={
                            isShelf ? 'book-card-author book-card-author--shelf' : 'book-card-author'
                        }
                    >
                        {author}
                    </p>
                </div>
            </article>
        </Link>
    )
}

export default BookCard

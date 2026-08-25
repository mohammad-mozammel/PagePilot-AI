import Link from 'next/link'
import { Check } from 'lucide-react'
import Reveal from '@/components/Reveal'

const PLANS = [
    {
        kicker: 'Plan 01',
        name: 'Free',
        pitch: 'Try it with your first book.',
        points: ['1 book on your shelf', '5-minute voice sessions', '50 sessions a month'],
        cta: 'Start free',
        href: '/books/new',
        featured: false,
    },
    {
        kicker: 'Plan 02',
        name: 'Standard',
        pitch: 'For steady readers.',
        points: ['10 books on your shelf', '15-minute voice sessions', '100 sessions a month', 'Session history'],
        cta: 'Choose Standard',
        href: '/subscriptions',
        featured: false,
    },
    {
        kicker: 'Plan 03',
        name: 'Pro',
        pitch: 'For serious listeners.',
        points: [
            '100 books on your shelf',
            '60-minute voice sessions',
            'Unlimited monthly sessions',
            'Session history',
        ],
        cta: 'Go Pro',
        href: '/subscriptions',
        featured: true,
    },
]

const PricingTeaser = () => {
    return (
        <section className="mt-28 md:mt-36" aria-labelledby="plans-heading">
            <div className="section-head">
                <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />Membership</p>
                <h2 id="plans-heading" className="section-title md:text-4xl md:leading-tight">
                    Start free, upgrade when you&apos;re hooked
                </h2>
                <p className="subtitle !text-base">
                    Every plan includes the full experience — conversation, summaries and read-aloud.
                    Higher tiers just remove the limits.
                </p>
            </div>

            <Reveal stagger className="plans-grid">
                {PLANS.map(({ kicker, name, pitch, points, cta, href, featured }) => (
                    <article key={name} className={`plan-mini ${featured ? 'plan-mini--featured' : ''}`}>
                        {featured && <span className="plan-badge">Most popular</span>}

                        <p className="plan-kicker">{kicker}</p>
                        <h3 className="plan-name">{name}</h3>
                        <p className="plan-mini-pitch">{pitch}</p>

                        <div className="plan-divider" aria-hidden="true" />

                        <ul className="plan-mini-list">
                            {points.map((point) => (
                                <li key={point}>
                                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--accent-deep)]" aria-hidden="true" />
                                    {point}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto pt-8">
                            <Link
                                href={href}
                                className={featured ? 'btn-primary w-full text-sm' : 'btn-secondary w-full text-sm'}
                            >
                                {cta}
                            </Link>
                        </div>
                    </article>
                ))}
            </Reveal>

            <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
                <p className="text-sm text-[var(--text-muted)]">Change plans anytime · Cancel whenever</p>
                <Link href="/subscriptions" className="text-sm font-medium text-[var(--accent-text)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-4 decoration-[var(--accent-warm)]/50">
                    Full billing details
                </Link>
            </Reveal>
        </section>
    )
}

export default PricingTeaser

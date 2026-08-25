import Link from 'next/link'
import LogoMark from '@/components/LogoMark'

const exploreLinks = [
    { label: 'Library', href: '/' },
    { label: 'Add a book', href: '/books/new' },
]

const membershipLinks = [
    { label: 'See plans', href: '/subscriptions' },
]

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="footer-shell">
            <div className="wrapper py-12 md:py-14 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5">
                    <LogoMark size={26} />
                    <span className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                        Page<span className="italic text-[var(--accent-text)]">Pilot</span>
                    </span>
                </div>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed">
                        The voice-powered reading companion. Upload a PDF, talk with your book,
                        and listen while it&apos;s read aloud.
                    </p>
                    <p className="studio-label mt-2">Made for listeners</p>
                </div>

                <nav aria-label="Explore">
                    <p className="studio-label mb-4">Explore</p>
                    <ul className="flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
                        {exploreLinks.map(({ label, href }) => (
                            <li key={href}>
                                <Link href={href} className="footer-link">{label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Membership">
                    <p className="studio-label mb-4">Membership</p>
                    <ul className="flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
                        {membershipLinks.map(({ label, href }) => (
                            <li key={href}>
                                <Link href={href} className="footer-link">{label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="border-t border-[var(--border-subtle)]">
                <div className="wrapper py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                    <p>© {year} PagePilot AI</p>
                    <p>Listen to everything you meant to read.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

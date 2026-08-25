import Link from 'next/link'
import { Library } from 'lucide-react'

export default function NotFound() {
    return (
        <main id="main-content" className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <div
                className="relative flex items-end justify-center gap-1.5 h-16 w-48 mb-10 text-[var(--accent-warm)] opacity-80"
                aria-hidden="true"
            >
                {[34, 62, 88, 52, 96, 70, 44, 90, 58, 78].map((h, i) => (
                    <span
                        key={i}
                        className="flex-1 max-w-[8px] rounded-full bg-current origin-bottom animate-[eq-bounce_1.15s_ease-in-out_infinite]"
                        style={{
                            height: `${h}%`,
                            animationDelay: `-${(i * 0.13 + 0.2).toFixed(2)}s`,
                            animationDuration: `${(1 + (i % 4) * 0.09).toFixed(2)}s`,
                        }}
                    />
                ))}
            </div>

            <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />Error 404</p>
            <h1 className="page-title-xl !text-4xl md:!text-5xl mt-4 max-w-lg">
                This page wandered off the <em className="italic text-[var(--accent-warm)]">shelf.</em>
            </h1>
            <p className="subtitle mx-auto mt-4 !max-w-sm text-base">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <Link href="/" className="hero-cta mt-8">
                <Library className="w-4 h-4" aria-hidden="true" />
                Back to your library
            </Link>
        </main>
    )
}

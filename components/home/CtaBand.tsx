import Link from 'next/link'
import Reveal from '@/components/Reveal'

const CTA_BARS = [
    { h: 40, d: '-0.9s', dur: '1.08s' },
    { h: 70, d: '-0.45s', dur: '1.22s' },
    { h: 95, d: '-1.1s', dur: '0.98s' },
    { h: 55, d: '-0.6s', dur: '1.3s' },
    { h: 85, d: '-0.3s', dur: '1.04s' },
    { h: 45, d: '-0.8s', dur: '1.16s' },
    { h: 75, d: '-1.2s', dur: '1.02s' },
]

const CtaBand = () => {
    return (
        <Reveal>
            <section className="cta-band" aria-labelledby="cta-heading">
                <div
                    className="flex items-end justify-center gap-2 h-10 w-40 mb-2 text-[#f0b055]/70"
                    aria-hidden="true"
                >
                    {CTA_BARS.map((bar, i) => (
                        <span
                            key={i}
                            className="w-1.5 origin-bottom rounded-full bg-current animate-[eq-bounce_1.15s_ease-in-out_infinite]"
                            style={{ height: `${bar.h}%`, animationDelay: bar.d, animationDuration: bar.dur }}
                        />
                    ))}
                </div>

                <p className="studio-label !text-[#b3a78e] justify-center">
                    <span className="studio-label-dot" aria-hidden="true" />
                    Ready when you are
                </p>

                <h2 id="cta-heading" className="cta-band-title">
                  Give your next book a <em className="italic text-[#f0b055]">voice.</em>
                </h2>

                <Link href="/books/new" className="hero-cta !mt-2">
                    Add a book — it&apos;s free
                </Link>

                <p className="cta-band-note">Works in your browser · No installs · 60-second setup</p>
            </section>
        </Reveal>
    )
}

export default CtaBand

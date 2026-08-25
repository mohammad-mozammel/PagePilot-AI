import { Headphones, ListChecks, MessagesSquare } from 'lucide-react'
import Reveal from '@/components/Reveal'
import { voiceOptions } from '@/lib/constants'

const READ_BARS = [
    { h: 35, d: '-0.9s', dur: '1.15s' },
    { h: 70, d: '-0.45s', dur: '1.05s' },
    { h: 95, d: '-1.1s', dur: '1.3s' },
    { h: 50, d: '-0.6s', dur: '0.98s' },
    { h: 85, d: '-0.25s', dur: '1.2s' },
    { h: 40, d: '-0.75s', dur: '1.12s' },
    { h: 65, d: '-1.2s', dur: '1.02s' },
    { h: 30, d: '-0.55s', dur: '1.28s' },
    { h: 75, d: '-0.95s', dur: '1.06s' },
    { h: 55, d: '-0.35s', dur: '1.22s' },
]

const VOICES = Object.values(voiceOptions)

const BentoFeatures = () => {
    return (
        <section className="mt-28 md:mt-36" aria-labelledby="features-heading">
            <div className="section-head">
                <p className="studio-label"><span className="studio-label-dot" aria-hidden="true" />Why PagePilot</p>
                <h2 id="features-heading" className="section-title md:text-4xl md:leading-tight max-w-xl">
                    A reading companion that answers back
                </h2>
                <p className="subtitle !text-base !max-w-lg">
                    Not a text-to-speech robot — an assistant that knows your book and talks it through with you.
                </p>
            </div>

            <Reveal stagger className="bento-grid">
                {/* Talk to any page — wide cell */}
                <article className="bento-card bento-card-wide">
                    <div className="bento-glow" aria-hidden="true" />
                    <span className="hiw-icon relative" aria-hidden="true">
                        <MessagesSquare className="w-5 h-5" />
                    </span>
                    <div className="relative">
                        <h3 className="bento-title">Talk to any page</h3>
                        <p className="bento-text mt-1.5 max-w-md">
                            Pause mid-chapter and ask. The assistant has your whole book in context,
                            so answers stay on the page you&apos;re on.
                        </p>
                    </div>
                    <div className="mini-chat bento-visual max-w-sm" aria-hidden="true">
                        <p className="ml-auto w-fit rounded-xl rounded-tr-[4px] bg-[var(--accent-warm)] px-3 py-1.5 text-xs font-medium text-[#231a07]">
                            What did the author mean by “the plateau of latent potential”?
                        </p>
                        <p className="w-fit rounded-xl rounded-tl-[4px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 text-xs leading-relaxed text-[var(--text-secondary)] shadow-soft-sm">
                            Progress feels invisible until it compounds — habits look like failure right
                            before they break through.
                        </p>
                    </div>
                </article>

                {/* Summaries */}
                <article className="bento-card">
                    <span className="hiw-icon" aria-hidden="true">
                        <ListChecks className="w-5 h-5" />
                    </span>
                    <h3 className="bento-title">Summaries on demand</h3>
                    <p className="bento-text">
                        A one-line recap or the whole argument of the book — in plain language, out loud.
                    </p>
                </article>

                {/* Read-aloud */}
                <article className="bento-card">
                    <span className="hiw-icon" aria-hidden="true">
                        <Headphones className="w-5 h-5" />
                    </span>
                    <h3 className="bento-title">Read-aloud mode</h3>
                    <p className="bento-text">
                        Commute, cook, rest your eyes — it picks up where you left off.
                    </p>
                    <div className="eq-display bento-visual" aria-hidden="true">
                        {READ_BARS.map((bar, i) => (
                            <span
                                key={i}
                                style={{ height: `${bar.h}%`, animationDelay: bar.d, animationDuration: bar.dur }}
                            />
                        ))}
                    </div>
                </article>

                {/* Narrator gallery — wide cell */}
                <article className="bento-card bento-card-wide md:col-start-1 md:col-end-3">
                    <div>
                        <h3 className="bento-title">Choose your narrator</h3>
                        <p className="bento-text mt-1.5">
                            Five studio-grade voices. Every book keeps the one you pick.
                        </p>
                    </div>
                    <div className="voice-chip-row bento-visual">
                        {VOICES.map((voice) => (
                            <div key={voice.id} className="voice-chip">
                                <span className="voice-chip-name">
                                    {voice.name}
                                    <span className="eq-mini" aria-hidden="true">
                                        {[70, 100, 55, 85].map((h, i) => (
                                            <span key={i} style={{ height: `${h}%`, animationDelay: `-${0.25 + i * 0.18}s` }} />
                                        ))}
                                    </span>
                                </span>
                                <span className="voice-chip-desc">{voice.description}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </Reveal>
        </section>
    )
}

export default BentoFeatures

import Image from "next/image";
import { Mic } from 'lucide-react'

// Decorative product preview — a frozen PagePilot voice session.
const MOCK_COVER_URL =
    'https://xre0b3beuotbfimr.public.blob.vercel-storage.com/atomic_habits_cover-Qms33lgIwSFaTVnO2Mw3i0bQg5aTFv.png'
const EQ_BARS = [
    { h: 40, d: '-0.9s', dur: '1.05s' },
    { h: 75, d: '-0.5s', dur: '1.2s' },
    { h: 95, d: '-1.05s', dur: '0.98s' },
    { h: 55, d: '-0.35s', dur: '1.3s' },
    { h: 85, d: '-0.8s', dur: '1.12s' },
    { h: 45, d: '-0.6s', dur: '1.02s' },
    { h: 70, d: '-1.15s', dur: '1.24s' },
]

const HeroSessionMock = () => {
    return (
        <div className="session-mock anim-rise" style={{ animationDelay: '300ms' }} aria-hidden="true">
            <div className="session-mock-head">
                <span className="inline-flex items-center gap-2">
                    <span className="studio-label-dot studio-label-live" />
                    Live session
                </span>
                <span>04:12 / 05:00</span>
            </div>

            <div className="session-mock-body">
                <div className="session-mock-book">
                    <span className="session-mock-cover !block overflow-hidden">
                        <Image
                            src={MOCK_COVER_URL}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                            priority
                        />
                    </span>
                    <span>
                        <span className="block font-serif text-sm font-semibold text-[var(--text-primary)]">
                            Atomic Habits
                        </span>
                        <span className="block text-xs text-[var(--text-muted)]">James Clear</span>
                    </span>
                    <span className="session-mock-chip">
                        <span className="size-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                        Listening
                    </span>
                </div>

                <p className="session-mock-bubble-user">Summarize chapter 3 in one line.</p>

                <p className="session-mock-bubble-ai">
                    Small habits compound — tiny daily wins beat grand plans, because systems
                    outlast motivation.
                </p>

                <div className="session-mock-input">
                    <span className="session-mock-mic">
                        <Mic className="size-4" />
                    </span>
                    <span className="flex flex-1 items-end gap-1 text-[var(--accent-deep)]" aria-hidden="true">
                        {EQ_BARS.map((bar, i) => (
                            <span
                                key={i}
                                className="w-1 origin-bottom rounded-full bg-current animate-[eq-bounce_1.15s_ease-in-out_infinite]"
                                style={{ height: `${bar.h}%`, animationDelay: bar.d, animationDuration: bar.dur }}
                            />
                        ))}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">Ask anything…</span>
                </div>
            </div>
        </div>
    )
}

export default HeroSessionMock

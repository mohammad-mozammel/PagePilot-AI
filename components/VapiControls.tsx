'use client'

import { useEffect, useRef } from 'react';
import useVapi, { CallStatus } from '@/hooks/useVapi'
import { Mic, Square, X } from "lucide-react";
import { IBook } from "@/types";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import Transcript from "./Transcript";

const STATUS_CONFIG: Record<CallStatus, { label: string }> = {
    idle: { label: 'Ready' },
    connecting: { label: 'Connecting' },
    starting: { label: 'Connecting' },
    listening: { label: 'Listening' },
    thinking: { label: 'Thinking' },
    speaking: { label: 'Speaking' },
};

// Deterministic bar config so server and client render identically.
const PLAYER_EQ_BARS = [
    { base: 62, gain: 1.0 },
    { base: 88, gain: 0.72 },
    { base: 55, gain: 1.25 },
    { base: 95, gain: 0.55 },
    { base: 70, gain: 0.95 },
];

export default function VapiControls({ book }: { book: IBook }) {

    const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, limitError, maxDurationSeconds, showTimeWarning, volumeRef } = useVapi(book)

    const { title, author, coverURL, persona } = book;
    const isBusy = status === 'connecting' || status === 'starting';
    const progress = maxDurationSeconds > 0
        ? Math.min(100, Math.round((duration / maxDurationSeconds) * 100))
        : 0;

    /* ------------------------------------------------------------
       Voice-reactive animation.
       A single rAF loop reads the live audio level (volumeRef,
       fed by Vapi's 'volume-level' events) and writes directly to
       DOM styles — no React re-renders per frame.
       - speaking:   real AI output volume + a synthetic floor so the
                     pulse never looks dead on quiet syllables
       - listening:  user microphone level
       - thinking:   slow breathing glow
       Respects prefers-reduced-motion by doing nothing.
    ------------------------------------------------------------ */
    const micBtnRef = useRef<HTMLButtonElement>(null);
    const pulseRef = useRef<HTMLSpanElement>(null);
    const eqRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        if (!isActive) return;
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let raf = 0;
        let smooth = 0;

        const tick = (now: number) => {
            // Smooth the raw level for organic motion
            const target = Math.min(1, volumeRef.current * 1.7);
            smooth += (target - smooth) * 0.22;

            // Synthetic floor keeps the AI voice visibly "alive"
            const synth =
                0.26 +
                0.20 * Math.sin(now / 128) +
                0.10 * Math.sin(now / 67 + 1.3);

            let lvl = 0;
            if (status === 'speaking') {
                lvl = Math.max(0, Math.min(1, Math.max(smooth, synth)));
            } else if (status === 'listening') {
                lvl = Math.max(0, Math.min(1, smooth * 1.9));
            } else {
                // connecting / starting / thinking → calm breathing
                lvl = 0.16 + 0.08 * Math.sin(now / 320);
            }

            // Mic button — scale + dynamic amber glow
            const btn = micBtnRef.current;
            if (btn) {
                btn.style.transform = `scale(${(1 + lvl * 0.09).toFixed(4)})`;
                btn.style.boxShadow =
                    `0 0 ${(12 + lvl * 36).toFixed(1)}px rgba(232,163,61,${(0.25 + lvl * 0.42).toFixed(3)}), ` +
                    `inset 0 1px 0 rgba(255,240,205,.6)`;
            }

            // Pulse ring — breathes outward with the voice
            const ring = pulseRef.current;
            if (ring) {
                ring.style.opacity = `${(0.18 + lvl * 0.5).toFixed(3)}`;
                ring.style.transform = `scale(${(1 + lvl * 0.35).toFixed(4)})`;
            }

            // EQ bars — height follows level with per-bar gain + wobble
            eqRefs.current.forEach((el, i) => {
                if (!el) return;
                const cfg = PLAYER_EQ_BARS[i];
                const wobble = 1 + 0.16 * Math.sin(now / 92 + i * 1.7);
                const h = Math.max(14, Math.min(100, lvl * 100 * cfg.gain * wobble + 15));
                el.style.height = `${h.toFixed(1)}%`;
            });

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        // Snapshot refs so the cleanup resets the same nodes it animated
        const btn = micBtnRef.current;
        const ringEl = pulseRef.current;
        const eqEls = eqRefs.current.slice();
        return () => {
            cancelAnimationFrame(raf);
            if (btn) {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            }
            if (ringEl) ringEl.style.opacity = '';
            eqEls.forEach((el) => { if (el) el.style.height = ''; });
        };
    }, [isActive, status, volumeRef]);

    return (

        <>
            {limitError && (
                <div className="error-banner" role="alert">
                    <div className="error-banner-content">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[var(--text-primary)]">{limitError}</p>
                            <a
                                href="/subscriptions"
                                className="error-banner-link"
                            >
                                Upgrade your plan
                            </a>
                        </div>
                        <button
                            onClick={clearError}
                            aria-label="Dismiss error"
                            className="error-banner-dismiss"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-5">
                {/* Horizontal sticky player bar — controls stay visible while the transcript scrolls */}
                <section
                    className="player-panel"
                    data-live={isActive}
                    aria-label={`Voice session player for ${title}`}
                >
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                        <Image
                            src={coverURL}
                            alt={`Cover of ${title} by ${author}`}
                            width={152}
                            height={220}
                            className="player-cover"
                            style={{ boxShadow: isActive ? 'var(--shadow-glow), var(--shadow-book)' : 'var(--shadow-book)' }}
                            priority
                        />

                        {/* Title + meta + live indicators */}
                        <div className="min-w-0 flex-1">
                            <h1 className="player-title truncate">{title}</h1>
                            <p className="player-meta">
                                <span className="truncate">{author}</span>
                                <span aria-hidden="true">·</span>
                                <span className="player-voice-chip">{persona || 'Rachel'}</span>
                            </p>

                            <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span
                                    className="player-status vapi-status-label"
                                    data-state={isActive ? 'live' : 'idle'}
                                    key={STATUS_CONFIG[status].label}
                                >
                                    <span className={`vapi-status-dot ${status === 'idle' ? 'vapi-status-dot-ready' : status === 'listening' || status === 'speaking' ? 'vapi-status-dot-listening' : 'vapi-status-dot-thinking'}`} aria-hidden="true" />
                                    {STATUS_CONFIG[status].label}
                                </span>

                                {isActive && (
                                    <span className="player-eq player-eq--synced" aria-hidden="true">
                                        {PLAYER_EQ_BARS.map((bar, i) => (
                                            <span
                                                key={i}
                                                ref={(el) => { eqRefs.current[i] = el; }}
                                                style={{ height: `${bar.base}%` }}
                                            />
                                        ))}
                                    </span>
                                )}

                                <span className={`vapi-timer player-timer ${showTimeWarning ? '!text-[#d64c3c]' : ''}`}>
                                    {formatDuration(duration)}
                                    {maxDurationSeconds > 0 && ` / ${formatDuration(maxDurationSeconds)}`}
                                </span>
                            </div>

                            {maxDurationSeconds > 0 && (
                                <div
                                    className="session-progress"
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={progress}
                                    aria-label="Session time used"
                                >
                                    <div
                                        className={`session-progress-fill ${showTimeWarning ? '!bg-[#d64c3c]' : ''}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Transport control */}
                        <div className="relative shrink-0 sm:ml-auto">
                            {isActive && (
                                <span
                                    ref={pulseRef}
                                    className="vapi-pulse-ring vapi-pulse-ring--btn"
                                    aria-hidden="true"
                                />
                            )}
                            <button
                                ref={micBtnRef}
                                onClick={isActive ? stop : start}
                                disabled={isBusy}
                                aria-label={isActive ? 'Stop voice conversation' : 'Start voice conversation'}
                                className={`vapi-mic-btn vapi-mic-btn--lg relative z-10 ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                            >
                                {isActive ? <Square className="size-5 md:size-6" /> : <Mic />}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Transcript — full width below the player */}
                <Transcript
                    messages={messages}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                    isActive={isActive}
                    thinking={status === 'thinking'}
                    onStart={start}
                    bookTitle={title}
                />
            </div>
        </>
    )
}

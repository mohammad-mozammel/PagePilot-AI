'use client'

import useVapi, { CallStatus } from '@/hooks/useVapi'
import { Mic, MicOff, X, Volume2, Clock } from "lucide-react";
import { IBook } from "@/types";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import Transcript from "./Transcript";

const STATUS_CONFIG: Record<CallStatus, { label: string; dotClass: string }> = {
    idle: { label: 'Ready', dotClass: 'vapi-status-dot-ready' },
    connecting: { label: 'Connecting', dotClass: 'vapi-status-dot-connecting' },
    starting: { label: 'Starting', dotClass: 'vapi-status-dot-connecting' },
    listening: { label: 'Listening', dotClass: 'vapi-status-dot-listening' },
    thinking: { label: 'Thinking', dotClass: 'vapi-status-dot-thinking' },
    speaking: { label: 'Speaking', dotClass: 'vapi-status-dot-speaking' },
};

const VapiControls = ({ book }: { book: IBook }) => {

    const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, limitError, maxDurationSeconds, showTimeWarning } = useVapi(book)

    const { title, author, coverURL, persona } = book;

    return (

        <>
            {limitError && (
                <div className="error-banner">
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

            <div className="reading-layout">
                {/* Sticky left rail — cover, mic, and status */}
                <aside className="reading-sidebar reading-sidebar-sticky">
                    <div className="vapi-cover-wrapper mx-auto w-fit">
                        <Image
                            src={coverURL}
                            alt={`Cover of ${title} by ${author}`}
                            width={140}
                            height={196}
                            className="w-[140px] h-[196px] object-cover rounded-lg"
                            style={{ boxShadow: "var(--shadow-book)" }}
                            priority
                        />
                        <div className="vapi-mic-wrapper relative">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className="vapi-pulse-ring" />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting'}
                                aria-label={isActive ? 'Stop voice conversation' : 'Start voice conversation'}
                                className={`vapi-mic-btn shadow-md !w-[52px] !h-[52px] z-10 ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                            >
                                {isActive ? (
                                    <Mic className="size-6 text-[#1C1A17]" />
                                ) : (
                                    <MicOff className="size-6 text-[#1C1A17]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <h1 className="font-serif text-lg font-semibold text-[var(--text-primary)] text-center mt-7">
                        {title}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] text-center mt-0.5">{author}</p>

                    <div className="reading-status-list">
                        <div className="reading-status-row">
                            <span className={`vapi-status-dot ${STATUS_CONFIG[status].dotClass}`} aria-hidden="true" />
                            <span key={STATUS_CONFIG[status].label} className="vapi-status-label">
                                {STATUS_CONFIG[status].label}
                            </span>
                        </div>
                        <div className="reading-status-row">
                            <Volume2 className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                            <span>Voice: {persona || "Rachel"}</span>
                        </div>
                        <div className="reading-status-row">
                            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                            <span className={`vapi-timer ${showTimeWarning ? 'text-[#A6461E]' : ''}`}>
                                {formatDuration(duration)}
                                {maxDurationSeconds > 0 && `/${formatDuration(maxDurationSeconds)}`}
                                {showTimeWarning && ' · time left'}
                            </span>
                        </div>
                    </div>
                </aside>

                {/* Chat-style transcript */}
                <div className="reading-main">
                    <Transcript
                        messages={messages}
                        currentMessage={currentMessage}
                        currentUserMessage={currentUserMessage}
                    />
                </div>
            </div>
        </>
    )
}

export default VapiControls

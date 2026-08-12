'use client'

import useVapi, { CallStatus } from '@/hooks/useVapi'
import { Mic, MicOff, X } from "lucide-react";
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

            <section className="vapi-header-card">
                <div className="vapi-cover-wrapper">
                    <Image
                        src={coverURL}
                        alt={`Cover of ${title} by ${author}`}
                        width={120}
                        height={170}
                        className="w-[120px] h-[170px] object-cover rounded-lg"
                        style={{ boxShadow: "var(--shadow-book)" }}
                        priority
                    />
                    <div className="vapi-mic-wrapper relative">
                        {isActive && (status === 'speaking' || status === 'thinking') && (
                            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                        )}
                        <button
                            onClick={isActive ? stop : start}
                            disabled={status === 'connecting'}
                            aria-label={isActive ? 'Stop voice conversation' : 'Start voice conversation'}
                            className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                        >
                            {isActive ? (
                                <Mic className="size-7 text-[#212a3b]" />
                            ) : (
                                <MicOff className="size-7 text-[#212a3b]" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                        {title}
                    </h1>
                    <p className="mt-1 text-[var(--text-secondary)]">by {author}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="vapi-status-indicator">
                            <span className={`vapi-status-dot ${STATUS_CONFIG[status].dotClass}`} aria-hidden="true" />
                            <span className="vapi-status-text">
                                <span key={STATUS_CONFIG[status].label} className="vapi-status-label">
                                    {STATUS_CONFIG[status].label}
                                </span>
                            </span>
                        </span>
                        <span className="vapi-status-indicator">
                            <span className="vapi-status-text">Voice: {persona || "Rachel"}</span>
                        </span>
                        <span className="vapi-status-indicator">
                            <span className={`vapi-status-text vapi-timer ${showTimeWarning ? 'text-[#b45309]' : ''}`}>
                                {formatDuration(duration)}
                                {maxDurationSeconds > 0 && `/${formatDuration(maxDurationSeconds)}`}
                                {showTimeWarning && ' · time left'}
                            </span>
                        </span>
                    </div>
                </div>
            </section>


            <section className="vapi-transcript-wrapper">
                <Transcript
                    messages={messages}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </section>
        </>
    )
}

export default VapiControls

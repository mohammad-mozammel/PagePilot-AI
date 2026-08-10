'use client'

import useVapi from '@/hooks/useVapi'
import { Mic, MicOff } from "lucide-react";
import { IBook } from "@/types";
import Image from "next/image";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {

    const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, limitError, } = useVapi(book)

    const { title, author, coverURL, persona } = book;

    return (

        <>
            <section className="vapi-header-card">
                <div className="vapi-cover-wrapper">
                    <Image
                        src={coverURL}
                        alt={`Cover of ${title} by ${author}`}
                        width={120}
                        height={170}
                        className="`w-[120px] h-[170px]` object-cover rounded-lg"
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
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold `text-[var(--text-primary)]`">
                        {title}
                    </h1>
                    <p className="mt-1 `text-[var(--text-secondary)]`">by {author}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="vapi-status-indicator">
                            <span className="vapi-status-dot vapi-status-dot-ready" aria-hidden="true" />
                            <span className="vapi-status-text">Ready</span>
                        </span>
                        <span className="vapi-status-indicator">
                            <span className="vapi-status-text">Voice: {persona || "Rachel"}</span>
                        </span>
                        <span className="vapi-status-indicator">
                            <span className="vapi-status-text">0:00/15:00</span>
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
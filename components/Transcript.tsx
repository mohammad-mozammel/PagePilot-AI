'use client'

import { useEffect, useRef } from "react";
import { AudioLines, CornerDownRight } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
    messages: Messages[];
    currentMessage?: string;
    currentUserMessage?: string;
    isActive?: boolean;
    /** Assistant is composing an answer — show human typing dots */
    thinking?: boolean;
    onStart?: () => void;
    bookTitle?: string;
}

interface MessageBubbleProps {
    role: string;
    content: string;
    streaming?: boolean;
}

const MessageBubble = ({ role, content, streaming = false }: MessageBubbleProps) => {
    const isUser = role === "user";

    return (
        <div className={`chat-row ${isUser ? "chat-row-user" : "chat-row-assistant"}`}>
            {!isUser && (
                <div className="chat-avatar chat-avatar-assistant" aria-hidden="true">
                    <AudioLines className="w-3.5 h-3.5" />
                </div>
            )}
            <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                {content}
                {streaming && <span className="transcript-cursor" aria-hidden="true" />}
            </div>
            {isUser && (
                <div className="chat-avatar chat-avatar-user" aria-hidden="true">
                    <CornerDownRight className="w-3.5 h-3.5" />
                </div>
            )}
        </div>
    );
};

const Transcript = ({
    messages,
    currentMessage = "",
    currentUserMessage = "",
    isActive = false,
    thinking = false,
    onStart,
    bookTitle,
}: TranscriptProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, currentMessage, currentUserMessage, thinking]);

    const hasMessages =
        messages.length > 0 || currentMessage || currentUserMessage || thinking;

    return (
        <section className="transcript-container" aria-label="Session transcript">
            <header className="transcript-head">
                <span className="studio-label-dot" aria-hidden="true" />
                Transcript
                <span className="ml-auto normal-case tracking-normal text-[var(--text-muted)]">
                    {isActive ? "Live session" : "Standby"}
                </span>
            </header>

            {hasMessages ? (
                <div className="transcript-messages">
                    {messages.map((message, index) => (
                        <MessageBubble key={index} role={message.role} content={message.content} />
                    ))}
                    {currentUserMessage && (
                        <MessageBubble role="user" content={currentUserMessage} streaming />
                    )}
                    {currentMessage && (
                        <MessageBubble role="assistant" content={currentMessage} streaming />
                    )}
                    {thinking && !currentMessage && (
                        <div className="chat-row chat-row-assistant">
                            <div className="chat-avatar chat-avatar-assistant" aria-hidden="true">
                                <AudioLines className="w-3.5 h-3.5" />
                            </div>
                            <div className="chat-bubble chat-bubble-assistant">
                                <span className="typing-dots" role="status" aria-label="Assistant is thinking">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            ) : (
                <div className="transcript-empty px-6 py-14">
                    <div className="transcript-empty-icon" aria-hidden="true">
                        <AudioLines className="w-7 h-7" />
                    </div>
                    <p className="transcript-empty-text mt-2">
                        {bookTitle ? `“${bookTitle}” is ready to talk` : "Your book is ready to talk"}
                    </p>
                    <p className="transcript-empty-hint max-w-xs leading-relaxed">
                        Press the mic and talk naturally — for example:
                    </p>
                    <div className="transcript-prompts" aria-hidden="true">
                        <p className="transcript-prompt">“Summarize chapter one.”</p>
                        <p className="transcript-prompt">“What did the author mean here?”</p>
                        <p className="transcript-prompt">“Read it to me from the start.”</p>
                    </div>
                    {!isActive && onStart && (
                        <button
                            type="button"
                            onClick={onStart}
                            className="hero-cta !mt-6 text-sm !py-2.5 !px-5"
                        >
                            Start the conversation
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default Transcript;

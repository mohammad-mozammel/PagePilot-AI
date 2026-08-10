'use client'

import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
    messages: Messages[];
    currentMessage?: string;
    currentUserMessage?: string;
}

interface MessageBubbleProps {
    role: string;
    content: string;
    streaming?: boolean;
}

const MessageBubble = ({ role, content, streaming = false }: MessageBubbleProps) => {
    const isUser = role === "user";

    return (
        <div className={`transcript-message ${isUser ? "transcript-message-user" : "transcript-message-assistant"}`}>
            <div className={`transcript-bubble ${isUser ? "transcript-bubble-user" : "transcript-bubble-assistant"}`}>
                {content}
                {streaming && <span className="transcript-cursor" aria-hidden="true" />}
            </div>
        </div>
    );
};

const Transcript = ({ messages, currentMessage = "", currentUserMessage = "" }: TranscriptProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentMessage, currentUserMessage]);

    const hasMessages = messages.length > 0 || currentMessage || currentUserMessage;

    if (!hasMessages) {
        return (
            <section className="transcript-container">
                <div className="transcript-empty">
                    <Mic className="w-12 h-12 text-[#8B7355]" />
                    <p className="transcript-empty-text">No conversation yet</p>
                    <p className="transcript-empty-hint">Click the mic button above to start talking</p>
                </div>
            </section>
        );
    }

    return (
        <section className="transcript-container">
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
                <div ref={bottomRef} />
            </div>
        </section>
    );
};

export default Transcript;

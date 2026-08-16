'use client'

import { useEffect, useRef } from "react";
import { Mic, BookOpen, User } from "lucide-react";
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
        <div className={`chat-row ${isUser ? "chat-row-user" : "chat-row-assistant"}`}>
            {!isUser && (
                <div className="chat-avatar chat-avatar-assistant" aria-hidden="true">
                    <BookOpen className="w-3.5 h-3.5" />
                </div>
            )}
            <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                {content}
                {streaming && <span className="transcript-cursor" aria-hidden="true" />}
            </div>
            {isUser && (
                <div className="chat-avatar chat-avatar-user" aria-hidden="true">
                    <User className="w-3.5 h-3.5" />
                </div>
            )}
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
                    <Mic className="w-12 h-12 text-[#B08D4F]" />
                    <p className="transcript-empty-text">No conversation yet</p>
                    <p className="transcript-empty-hint">Click the mic button to start talking</p>
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

'use client';

// Create hooks/useVapi.ts: the core hook. Initializes Vapi SDK, manages call lifecycle (idle, connecting, starting, listening, thinking, speaking), tracks messages array + currentMessage streaming, handles duration timer with maxDuration enforcement, session tracking via server actions

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Vapi from '@vapi-ai/web';
import { useAuth } from '@clerk/nextjs';

import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from '@/lib/constants';
import { getVoice } from '@/lib/utils';
import { IBook, Messages } from '@/types';
import { startVoiceSession, endVoiceSession } from '@/lib/actions/session.actions';
import usePlan from '@/hooks/usePlan';

export function useLatestRef<T>(value: T) {
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref;
}

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;
const TIMER_INTERVAL_MS = 1000;
const SECONDS_PER_MINUTE = 60;
const TIME_WARNING_THRESHOLD = 60; // Show warning when this many seconds remain

let vapi: InstanceType<typeof Vapi>;
function getVapi() {
    if (!vapi) {
        if (!VAPI_API_KEY) {
            throw new Error('NEXT_PUBLIC_VAPI_API_KEY environment variable is not set');
        }
        vapi = new Vapi(VAPI_API_KEY);
    }
    return vapi;
}

export type CallStatus = 'idle' | 'connecting' | 'starting' | 'listening' | 'thinking' | 'speaking';

export function useVapi(book: IBook) {
    const { userId } = useAuth();
    const router = useRouter();
    const { isLoaded: isPlanLoaded, limits: planLimits } = usePlan();

    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [maxDurationSeconds, setMaxDurationSeconds] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef(false);
    const maxDurationSecondsRef = useRef(0);
    const planLimitSecondsRef = useRef(0);
    const vapiReadyRef = useRef(false);
    // Live audio level (0-1) from Vapi's volume-level events. Stored in a ref
    // (not state) because these events fire dozens of times per second and
    // consumers animate via requestAnimationFrame instead of re-renders.
    const volumeRef = useRef(0);
    const durationRef = useLatestRef(duration);
    const voice = book.persona || DEFAULT_VOICE;

    // Ends server-side session tracking with the duration recorded at call time.
    const handleEndSession = useCallback(() => {
        if (!sessionIdRef.current) return;
        const sessionId = sessionIdRef.current;
        sessionIdRef.current = null;
        endVoiceSession(sessionId, durationRef.current).catch((err) =>
            console.error('Failed to end voice session:', err),
        );
    }, [durationRef]);

    // Sync the plan-based session limit so the max duration is shown from page
    // load, and restored after a call ends or errors out.
    useEffect(() => {
        if (isPlanLoaded) {
            planLimitSecondsRef.current = planLimits.maxSessionMinutes * SECONDS_PER_MINUTE;
            setMaxDurationSeconds(planLimitSecondsRef.current);
        }
    }, [isPlanLoaded, planLimits.maxSessionMinutes]);

    // Set up Vapi event listeners
    useEffect(() => {
        const handlers = {
            'call-start': () => {
                isStoppingRef.current = false;
                setStatus('starting'); // AI speaks first, wait for it
                setCurrentMessage('');
                setCurrentUserMessage('');

                // Start duration timer
                startTimeRef.current = Date.now();
                setDuration(0);
                timerRef.current = setInterval(() => {
                    if (startTimeRef.current) {
                        const newDuration = Math.floor((Date.now() - startTimeRef.current) / TIMER_INTERVAL_MS);
                        setDuration(newDuration);

                        // Check duration limit
                        if (
                            maxDurationSecondsRef.current > 0 &&
                            newDuration >= maxDurationSecondsRef.current
                        ) {
                            getVapi().stop();
                            setLimitError(
                                `Session time limit (${Math.floor(
                                    maxDurationSecondsRef.current / SECONDS_PER_MINUTE,
                                )} minutes) reached. Upgrade your plan for longer sessions.`,
                            );
                            redirectTimeoutRef.current = setTimeout(() => {
                                router.push('/');
                            }, 2000);
                        }
                    }
                }, TIMER_INTERVAL_MS);
            },

            'call-end': () => {
                // Don't reset isStoppingRef here - delayed events may still fire
                setStatus('idle');
                setCurrentMessage('');
                setCurrentUserMessage('');

                // Stop timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // End session tracking
                handleEndSession();

                startTimeRef.current = null;
                maxDurationSecondsRef.current = 0;
                setMaxDurationSeconds(planLimitSecondsRef.current);
            },

            'speech-start': () => {
                if (!isStoppingRef.current) {
                    setStatus('speaking');
                }
            },
            'speech-end': () => {
                if (!isStoppingRef.current) {
                    // After AI finishes speaking, user can talk
                    setStatus('listening');
                }
            },

            'volume-level': (level: number) => {
                volumeRef.current = typeof level === 'number' && Number.isFinite(level)
                    ? Math.min(1, Math.max(0, level))
                    : 0;
            },

            message: (message: {
                type: string;
                role: string;
                transcriptType: string;
                transcript: string;
            }) => {
                if (message.type !== 'transcript') return;

                // User finished speaking → AI is thinking
                if (message.role === 'user' && message.transcriptType === 'final') {
                    if (!isStoppingRef.current) {
                        setStatus('thinking');
                    }
                    setCurrentUserMessage('');
                }

                // Partial user transcript → show real-time typing
                if (message.role === 'user' && message.transcriptType === 'partial') {
                    setCurrentUserMessage(message.transcript);
                    return;
                }

                // Partial AI transcript → show word-by-word
                if (message.role === 'assistant' && message.transcriptType === 'partial') {
                    setCurrentMessage(message.transcript);
                    return;
                }

                // Final transcript → add to messages
                if (message.transcriptType === 'final') {
                    if (message.role === 'assistant') setCurrentMessage('');
                    if (message.role === 'user') setCurrentUserMessage('');

                    setMessages((prev) => {
                        const isDupe = prev.some(
                            (m) => m.role === message.role && m.content === message.transcript,
                        );
                        return isDupe ? prev : [...prev, { role: message.role, content: message.transcript }];
                    });
                }
            },

            error: (error: Error) => {
                console.error('Vapi error:', error);
                // Don't reset isStoppingRef here - delayed events may still fire
                setStatus('idle');
                setCurrentMessage('');
                setCurrentUserMessage('');

                // Stop timer on error
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // End session tracking on error
                handleEndSession();

                // Show user-friendly error message
                const errorMessage = error.message?.toLowerCase() || '';
                if (errorMessage.includes('timeout') || errorMessage.includes('silence')) {
                    setLimitError('Session ended due to inactivity. Click the mic to start again.');
                } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
                    setLimitError('Connection lost. Please check your internet and try again.');
                } else {
                    setLimitError('Session ended unexpectedly. Click the mic to start again.');
                }

                startTimeRef.current = null;
                maxDurationSecondsRef.current = 0;
                setMaxDurationSeconds(planLimitSecondsRef.current);
            },
        };

        // Register all handlers. Guard against Vapi init failures so a missing
        // API key or SDK error doesn't crash the page / spam the console.
        try {
            Object.entries(handlers).forEach(([event, handler]) => {
                getVapi().on(event as keyof typeof handlers, handler as () => void);
            });
            vapiReadyRef.current = true;
        } catch (err) {
            console.error('Failed to initialize Vapi:', err);
        }

        return () => {
            if (!vapiReadyRef.current) return;

            // End active session on unmount
            if (sessionIdRef.current) {
                getVapi().stop();
                handleEndSession();
            }
            // Cleanup handlers
            Object.entries(handlers).forEach(([event, handler]) => {
                getVapi().off(event as keyof typeof handlers, handler as () => void);
            });
            if (timerRef.current) clearInterval(timerRef.current);
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
        };
    }, [durationRef, handleEndSession, router]);

    const start = useCallback(async () => {
        if (!userId) {
            setLimitError('Please sign in to start a voice session.');
            return;
        }

        setLimitError(null);
        setStatus('connecting');

        try {
            // Check session limits and create session record
            const result = await startVoiceSession(userId, book._id);

            if (!result.success) {
                setLimitError(result.error || 'Session limit reached. Please upgrade your plan.');
                setStatus('idle');
                return;
            }

            sessionIdRef.current = result.sessionId || null;
            // Enforce the plan's per-session duration limit
            const limitSeconds = (result.maxDurationMinutes ?? 0) * SECONDS_PER_MINUTE;
            maxDurationSecondsRef.current = limitSeconds;
            setMaxDurationSeconds(limitSeconds);

            const firstMessage = `Hey, good to meet you. Before we dive in — honest question: have you actually read ${book.title}, or are we starting fresh together?`;

            await getVapi().start(ASSISTANT_ID, {
                firstMessage,
                firstMessageMode: 'assistant-speaks-first',
                variableValues: {
                    title: book.title,
                    author: book.author,
                    bookId: book._id,
                },
                voice: {
                    provider: '11labs' as const,
                    voiceId: getVoice(voice).id,
                    model: 'eleven_turbo_v2_5' as const,
                    stability: VOICE_SETTINGS.stability,
                    similarityBoost: VOICE_SETTINGS.similarityBoost,
                    style: VOICE_SETTINGS.style,
                    useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
                },
            });
        } catch (err) {
            console.error('Failed to start call:', err);
            setStatus('idle');
            setLimitError('Failed to start voice session. Please try again.');
        }
    }, [book._id, book.title, book.author, voice, userId]);

    const stop = useCallback(() => {
        isStoppingRef.current = true;
        getVapi().stop();
    }, []);

    const clearError = useCallback(() => {
        setLimitError(null);
    }, []);

    const isActive =
        status === 'starting' ||
        status === 'listening' ||
        status === 'thinking' ||
        status === 'speaking';

    // Calculate remaining time
    const remainingSeconds = Math.max(0, maxDurationSeconds - duration);
    const showTimeWarning =
        isActive && remainingSeconds <= TIME_WARNING_THRESHOLD && remainingSeconds > 0;

    return {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        limitError,
        clearError,
        maxDurationSeconds,
        remainingSeconds,
        showTimeWarning,
        volumeRef,
    };
}

export default useVapi;
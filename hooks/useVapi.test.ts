import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IBook } from '@/types';

// --- Mocks -----------------------------------------------------------------

const vapiInstanceMocks = vi.hoisted(() => ({
    on: vi.fn(),
    off: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
}));

vi.mock('@vapi-ai/web', () => ({
    default: vi.fn().mockImplementation(() => vapiInstanceMocks),
}));

const useAuthMock = vi.hoisted(() => vi.fn(() => ({ userId: 'user-123' })));

vi.mock('@clerk/nextjs', () => ({
    useAuth: useAuthMock,
}));

const sessionActionsMock = vi.hoisted(() => ({
    startVoiceSession: vi.fn(),
    endVoiceSession: vi.fn(),
}));

vi.mock('@/lib/actions/session.actions', () => sessionActionsMock);

import useVapi from '@/hooks/useVapi';

const baseBook = {
    _id: 'book-1',
    title: 'Test Book',
    author: 'Test Author',
    persona: 'rachel',
} as unknown as IBook;

describe('useVapi - start() failure handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthMock.mockReturnValue({ userId: 'user-123' });
        sessionActionsMock.startVoiceSession.mockResolvedValue({
            success: true,
            sessionId: 'session-abc',
        });
        sessionActionsMock.endVoiceSession.mockResolvedValue({ success: true });
    });

    it('ends the tracked voice session with a 0 duration when vapi.start() throws', async () => {
        vapiInstanceMocks.start.mockRejectedValueOnce(new Error('network down'));

        const { result } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
        });

        expect(sessionActionsMock.startVoiceSession).toHaveBeenCalledWith('user-123', 'book-1');
        expect(sessionActionsMock.endVoiceSession).toHaveBeenCalledTimes(1);
        expect(sessionActionsMock.endVoiceSession).toHaveBeenCalledWith('session-abc', 0);
    });

    it('does not reset status to idle or set a limitError after a failed vapi.start() call (regression)', async () => {
        // Prior to this change, a failed start() call reset status to 'idle' and
        // surfaced a user-facing limitError message. That behavior was removed
        // in favor of ending the voice session record instead.
        vapiInstanceMocks.start.mockRejectedValueOnce(new Error('network down'));

        const { result } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
        });

        expect(result.current.status).toBe('connecting');
        expect(result.current.limitError).toBeNull();
    });

    it('does not attempt to end a voice session if no session id was tracked when vapi.start() throws', async () => {
        sessionActionsMock.startVoiceSession.mockResolvedValueOnce({
            success: true,
            sessionId: undefined,
        });
        vapiInstanceMocks.start.mockRejectedValueOnce(new Error('boom'));

        const { result } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
        });

        expect(sessionActionsMock.endVoiceSession).not.toHaveBeenCalled();
    });

    it('clears the session ref after ending it on error, so unmounting afterward does not end it a second time', async () => {
        vapiInstanceMocks.start.mockRejectedValueOnce(new Error('network down'));

        const { result, unmount } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
        });

        expect(sessionActionsMock.endVoiceSession).toHaveBeenCalledTimes(1);
        sessionActionsMock.endVoiceSession.mockClear();

        unmount();

        expect(sessionActionsMock.endVoiceSession).not.toHaveBeenCalled();
    });

    it('logs the error to the console when vapi.start() throws', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const error = new Error('network down');
        vapiInstanceMocks.start.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start call:', error);
        consoleErrorSpy.mockRestore();
    });

    it('does not call endVoiceSession when vapi.start() resolves successfully', async () => {
        vapiInstanceMocks.start.mockResolvedValueOnce(undefined);

        const { result } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
        });

        expect(vapiInstanceMocks.start).toHaveBeenCalledTimes(1);
        expect(sessionActionsMock.endVoiceSession).not.toHaveBeenCalled();
    });

    it('logs a secondary error if ending the voice session after a failed start also fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vapiInstanceMocks.start.mockRejectedValueOnce(new Error('network down'));
        sessionActionsMock.endVoiceSession.mockRejectedValueOnce(new Error('db unreachable'));

        const { result } = renderHook(() => useVapi(baseBook));

        await act(async () => {
            await result.current.start();
            // allow the fire-and-forget endVoiceSession().catch(...) chain to settle
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to end voice session on error:',
            expect.any(Error),
        );
        consoleErrorSpy.mockRestore();
    });
});
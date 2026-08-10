import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ImgHTMLAttributes } from 'react';
import type { IBook } from '@/types';

vi.mock('next/image', () => ({
    // eslint-disable-next-line @next/next/no-img-element
    default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt} />,
}));

const transcriptMock = vi.hoisted(() => vi.fn(() => <div data-testid="transcript" />));

vi.mock('./Transcript', () => ({
    default: transcriptMock,
}));

const useVapiMock = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/useVapi', () => ({
    default: useVapiMock,
}));

import VapiControls from '@/components/VapiControls';

const baseBook = {
    _id: 'book-1',
    title: 'Dune',
    author: 'Frank Herbert',
    coverURL: 'https://example.com/cover.jpg',
    persona: 'sarah',
} as unknown as IBook;

// Mirrors the shape returned by useVapi() *after* this PR: isBillingError and
// maxDurationSeconds are intentionally absent since VapiControls no longer
// destructures them.
const defaultHookValue = {
    status: 'idle' as const,
    isActive: false,
    messages: [],
    currentMessage: '',
    currentUserMessage: '',
    duration: 0,
    start: vi.fn(),
    stop: vi.fn(),
    clearError: vi.fn(),
    limitError: null as string | null,
};

describe('VapiControls', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useVapiMock.mockReturnValue({ ...defaultHookValue, start: vi.fn(), stop: vi.fn(), clearError: vi.fn() });
    });

    it('renders book title, author and the raw persona voice label', () => {
        render(<VapiControls book={baseBook} />);

        expect(screen.getByText('Dune')).toBeInTheDocument();
        expect(screen.getByText('by Frank Herbert')).toBeInTheDocument();
        expect(screen.getByText('Voice: sarah')).toBeInTheDocument();
    });

    it('renders successfully when useVapi() does not return isBillingError or maxDurationSeconds', () => {
        useVapiMock.mockReturnValue({ ...defaultHookValue });

        expect(() => render(<VapiControls book={baseBook} />)).not.toThrow();
        expect(screen.getByText('Dune')).toBeInTheDocument();
    });

    it('shows the inactive mic icon and calls start() when clicked while idle', () => {
        const start = vi.fn();
        useVapiMock.mockReturnValue({ ...defaultHookValue, isActive: false, status: 'idle', start, stop: vi.fn() });

        render(<VapiControls book={baseBook} />);

        fireEvent.click(screen.getByRole('button'));

        expect(start).toHaveBeenCalledTimes(1);
    });

    it('shows the active mic icon and calls stop() when clicked while active', () => {
        const stop = vi.fn();
        useVapiMock.mockReturnValue({
            ...defaultHookValue,
            isActive: true,
            status: 'listening',
            start: vi.fn(),
            stop,
        });

        render(<VapiControls book={baseBook} />);

        fireEvent.click(screen.getByRole('button'));

        expect(stop).toHaveBeenCalledTimes(1);
    });

    it('disables the mic button while connecting', () => {
        useVapiMock.mockReturnValue({ ...defaultHookValue, status: 'connecting' });

        render(<VapiControls book={baseBook} />);

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it.each(['speaking', 'thinking'] as const)(
        'shows the pulsing ping indicator while active and status is %s',
        (status) => {
            useVapiMock.mockReturnValue({ ...defaultHookValue, isActive: true, status });

            const { container } = render(<VapiControls book={baseBook} />);

            expect(container.querySelector('.animate-ping')).not.toBeNull();
        },
    );

    it('does not show the ping indicator when inactive, even if status is speaking', () => {
        useVapiMock.mockReturnValue({ ...defaultHookValue, isActive: false, status: 'speaking' });

        const { container } = render(<VapiControls book={baseBook} />);

        expect(container.querySelector('.animate-ping')).toBeNull();
    });

    it('does not show the ping indicator while active and listening', () => {
        useVapiMock.mockReturnValue({ ...defaultHookValue, isActive: true, status: 'listening' });

        const { container } = render(<VapiControls book={baseBook} />);

        expect(container.querySelector('.animate-ping')).toBeNull();
    });

    it('passes transcript state through to the Transcript component', () => {
        useVapiMock.mockReturnValue({
            ...defaultHookValue,
            messages: [{ role: 'user', content: 'hello' }],
            currentMessage: 'thinking...',
            currentUserMessage: 'still talking',
        });

        render(<VapiControls book={baseBook} />);

        const props = transcriptMock.mock.calls[0][0];
        expect(props.messages).toEqual([{ role: 'user', content: 'hello' }]);
        expect(props.currentMessage).toBe('thinking...');
        expect(props.currentUserMessage).toBe('still talking');
    });

    it('falls back to "Rachel" as the displayed voice label when the book has no persona', () => {
        useVapiMock.mockReturnValue({ ...defaultHookValue });

        render(<VapiControls book={{ ...baseBook, persona: undefined } as unknown as IBook} />);

        expect(screen.getByText('Voice: Rachel')).toBeInTheDocument();
    });
});
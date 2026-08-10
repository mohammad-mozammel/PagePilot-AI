import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/Database/mongoose', () => ({
    connectToDatabase: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/Database/models/book.model', () => ({
    default: {
        find: vi.fn(),
        findOne: vi.fn(),
        create: vi.fn(),
        countDocuments: vi.fn(),
        findByIdAndUpdate: vi.fn(),
    },
}));

const bookSegmentMock = vi.hoisted(() => ({
    find: vi.fn(),
    insertMany: vi.fn(),
}));

vi.mock('@/Database/models/book-segment.model', () => ({
    default: bookSegmentMock,
}));

vi.mock('@/lib/subscription.server', () => ({
    getUserPlan: vi.fn(),
}));

import { searchBookSegments } from '@/lib/actions/book.actions';

type SegmentQueryResult = unknown[] | Error;

const createSegmentQueryChain = (result: SegmentQueryResult) => {
    const chain = {
        select: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn(),
    };

    if (result instanceof Error) {
        chain.lean.mockRejectedValue(result);
    } else {
        chain.lean.mockResolvedValue(result);
    }

    return chain;
};

const BOOK_ID = '507f1f77bcf86cd799439011';

describe('searchBookSegments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns results from the text-index search without falling back to regex', async () => {
        const textResults = [{ _id: '1', content: 'hello world' }];
        bookSegmentMock.find.mockReturnValueOnce(createSegmentQueryChain(textResults));

        const result = await searchBookSegments(BOOK_ID, 'hello world', 5);

        expect(result).toEqual({ success: true, data: textResults });
        expect(bookSegmentMock.find).toHaveBeenCalledTimes(1);
    });

    it('returns an empty successful result for an empty query string instead of matching every segment', async () => {
        // Previously an empty query produced an empty regex pattern (''),
        // which matches every document. Now it short-circuits to no results.
        bookSegmentMock.find.mockReturnValueOnce(createSegmentQueryChain([]));

        const result = await searchBookSegments(BOOK_ID, '', 5);

        expect(result).toEqual({ success: true, data: [] });
        expect(bookSegmentMock.find).toHaveBeenCalledTimes(1);
    });

    it('returns an empty successful result without querying the regex fallback when the text index is unavailable and all keywords are too short', async () => {
        bookSegmentMock.find.mockReturnValueOnce(createSegmentQueryChain(new Error('text index not found')));

        const result = await searchBookSegments(BOOK_ID, 'a to be', 5);

        expect(result).toEqual({ success: true, data: [] });
        // Only the initial (failed) text-search call should have happened;
        // the regex fallback must be skipped entirely when there are no
        // usable keywords.
        expect(bookSegmentMock.find).toHaveBeenCalledTimes(1);
    });

    it('returns an empty successful result without querying the regex fallback when the text search yields no matches and no keyword is long enough', async () => {
        bookSegmentMock.find.mockReturnValueOnce(createSegmentQueryChain([]));

        const result = await searchBookSegments(BOOK_ID, 'ok', 5);

        expect(result).toEqual({ success: true, data: [] });
        expect(bookSegmentMock.find).toHaveBeenCalledTimes(1);
    });

    it('falls back to a regex search across keywords longer than 2 characters when the text search fails', async () => {
        const regexResults = [{ _id: '2', content: 'a chapter about dragons and magic' }];
        bookSegmentMock.find
            .mockReturnValueOnce(createSegmentQueryChain(new Error('no text index')))
            .mockReturnValueOnce(createSegmentQueryChain(regexResults));

        const result = await searchBookSegments(BOOK_ID, 'dragons and magic', 5);

        expect(result).toEqual({ success: true, data: regexResults });
        expect(bookSegmentMock.find).toHaveBeenCalledTimes(2);

        const regexCallArgs = bookSegmentMock.find.mock.calls[1][0];
        expect(regexCallArgs.content).toEqual({ $regex: 'dragons|and|magic', $options: 'i' });
        expect(regexCallArgs.bookId.toString()).toBe(BOOK_ID);
    });

    it('includes keywords exactly 3 characters long in the regex fallback (boundary: length > 2)', async () => {
        const regexResults = [{ _id: '3', content: 'do not stop' }];
        bookSegmentMock.find
            .mockReturnValueOnce(createSegmentQueryChain([]))
            .mockReturnValueOnce(createSegmentQueryChain(regexResults));

        const result = await searchBookSegments(BOOK_ID, 'to be or not', 5);

        expect(result).toEqual({ success: true, data: regexResults });
        const regexCallArgs = bookSegmentMock.find.mock.calls[1][0];
        // "to", "be", "or" are all length 2 and filtered out; only "not" (length 3) remains.
        expect(regexCallArgs.content.$regex).toBe('not');
    });

    it('surfaces an error result if the regex fallback query itself throws', async () => {
        bookSegmentMock.find
            .mockReturnValueOnce(createSegmentQueryChain([]))
            .mockReturnValueOnce(createSegmentQueryChain(new Error('database unavailable')));

        const result = await searchBookSegments(BOOK_ID, 'dragons and magic', 5);

        expect(result).toEqual({
            success: false,
            error: 'database unavailable',
            data: [],
        });
    });
});
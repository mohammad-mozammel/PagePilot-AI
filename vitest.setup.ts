import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

process.env.NEXT_PUBLIC_VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY || 'test-vapi-api-key';
process.env.NEXT_PUBLIC_ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID || 'test-assistant-id';

afterEach(() => {
    cleanup();
});
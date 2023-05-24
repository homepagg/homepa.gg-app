import { vi, beforeAll, afterAll, afterEach } from 'vitest';

import '@testing-library/jest-dom';
import { server } from './server';

window.IntersectionObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '0',
    thresholds: [0],
    takeRecords: vi.fn(),
}));

window.matchMedia =
    window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: vi.fn(),
            removeListener: vi.fn(),
        };
    };

window.ResizeObserver =
    window.ResizeObserver || require('resize-observer-polyfill');

window.scrollTo = vi.fn();

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => {
    vi.clearAllMocks();
    server.close();
});

afterEach(() => {
    vi.resetAllMocks();
    server.resetHandlers();
});

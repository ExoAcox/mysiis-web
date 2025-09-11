import { vi } from "vitest";

const axios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
        request: {
            use: vi.fn(),
            eject: vi.fn(),
        },
        response: {
            use: vi.fn(),
            eject: vi.fn(),
        },
    },
    isCancel: vi.fn(),
};

export default axios;

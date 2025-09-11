import { vi } from "vitest";

module.exports = {
    ...vi.importActual("@firebase/app"),
    collection: vi.fn(),
    doc: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
};

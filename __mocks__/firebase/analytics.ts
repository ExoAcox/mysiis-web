import { vi } from "vitest";

module.exports = {
    ...vi.importActual("@firebase/analytics"),
    logEvent: vi.fn(),
};

import { vi } from "vitest";

module.exports = {
    ...vi.importActual("axios-cache-interceptor"),
    setupCache: (instance: any) => instance,
    buildWebStorage: (instance: any) => instance,
};

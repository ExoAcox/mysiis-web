import { vi } from "vitest";

module.exports = {
    ...vi.importActual("firebase-admin/firestore"),
    getFirestore: () => ({ collection: () => ({ doc: () => ({ get: () => ({ exists: false, data: jest.fn() }) }) }) }),
};

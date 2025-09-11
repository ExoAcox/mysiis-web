import { vi } from "vitest";

export const useRouter = () => ({
    push: vi.fn(),
    replace: vi.fn(),
    query: { newsId: vi.fn() },
});

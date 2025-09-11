import "@testing-library/jest-dom";
import { vi, vitest } from "vitest";

vi.mock("json-to-csv-export");
vi.mock("next/image");
vi.mock("axios");
vi.mock("axios-cache-interceptor");
vi.mock("next/router");
vi.mock("next/image");
vi.mock("cookies-next");

vi.mock("@turf/helpers", () => ({
    polygon: () => ({
        type: "Polygon",
        coordinates: [
            [
                [-81, 41],
                [-88, 36],
                [-84, 31],
                [-80, 33],
                [-77, 39],
                [-81, 41],
            ],
        ],
    }),
}));

vi.mock("@hooks/useProfile", () => ({
    default: () => ({
        data: { userId: "id", fullname: "John Cena", status: "verified" },
        isPending: false,
        isSuccess: true,
    }),
}));

vi.mock("@hooks/usePoint", () => ({
    default: () => ({
        data: 1000,
        isPending: false,
        isSuccess: true,
    }),
}));

vi.mock("next/config", () => ({
    default: () => ({
        publicRuntimeConfig: {},
    }),
}));

vi.mock("next/image");

vi.mock("next/router", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
    }),
}));

global.console.warn = vi.fn();
global.console.error = vi.fn();

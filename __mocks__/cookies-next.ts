import { vi } from "vitest";

const store: any = {};

module.exports = {
    ...vi.importActual("cookies-next"),
    getCookie: (value: any) => store[value] || value || "token",
    setCookie: (key: string, value: any) => (store[key] = value.toString()),
    deleteCookie: (key: string) => delete store[key],
};

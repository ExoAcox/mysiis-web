import { vi } from "vitest";

module.exports = {
    ...vi.importActual("iron-session/next"),
    withIronSessionApiRoute: (callback: (data: any) => void) => callback({ req: { session: {} } }),
    withIronSessionSsr: (callback: (data: any) => void) => callback({ req: { session: {} } }),
};

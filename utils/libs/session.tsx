import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next";
import { parse } from "next-useragent";

import { intersection } from "@functions/common";

import { profileDefaultValue } from "./store";

const sessionOptions = (temporary?: boolean) => {
    const maxAge = temporary ? { maxAge: undefined } : {};

    return {
        password: process.env.SESSION_PASSWORD,
        cookieName: process.env.SESSION_KEY,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            ...maxAge,
        },
    };
};

declare module "iron-session" {
    interface IronSessionData {
        user?: User;
    }
}

export function sessionApi(handler: NextApiHandler, temporary?: "temporary") {
    return withIronSessionApiRoute(handler, sessionOptions(temporary === "temporary"));
}

export function session<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
    return withIronSessionSsr(handler, sessionOptions());
}

interface GetServer {
    context: GetServerSidePropsContext;
    permissions?: string[];
    roles?: string[];
    props?: object;
    guest?: boolean;
}

export const getServer = async ({ context, permissions, roles, props, guest }: GetServer) => {
    const { req } = context;

    const user = (req.session.user as User) || profileDefaultValue;

    let device = "desktop";
    if (context.req.headers["user-agent"]) {
        device = parse(context.req.headers["user-agent"])?.deviceType || "";
    }

    const redirect = { redirect: { destination: "/?unauthorized", permanent: false } };
    const unauthorized = guest ? { props: { user, access: "unauthorized", device, ...props } } : redirect;
    const forbidden = guest ? { props: { user, access: "forbidden", device, ...props } } : redirect;
    const allowed = { props: { user, access: "allowed", device, ...props } };

    if (!user.userId) return guest ? unauthorized : redirect;

    if (permissions) {
        try {
            if (!intersection(user.permission_keys, [...permissions, "development"]).length) {
                return forbidden;
            }
        } catch (error) {
            return unauthorized;
        }
    }

    if (roles) {
        try {
            if (!intersection(user.role_keys, roles).length) {
                return forbidden;
            }
        } catch (error) {
            return unauthorized;
        }
    }

    return allowed;
};

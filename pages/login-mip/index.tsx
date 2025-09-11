import axios from "axios";
import { setCookie } from "cookies-next";
// import { logEvent } from "firebase/analytics";
import { nanoid } from "nanoid";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

// import { analytic } from "@libs/firebase";
import { useProfileStore } from "@libs/store";

import { getTokenMip } from "@api/account/auth";
import { getCurrentUser } from "@api/account/user";

import { Spinner } from "@components/loader";

const LoginMip: React.FC<{ token: string }> = ({ token }) => {
    const setProfile = useProfileStore((state) => state.set);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            getToken(token);
        } else {
            router.replace("/login");
        }
    }, [router.query]);

    const getToken = async (guid: string) => {
        try {
            const token = await getTokenMip(guid);
            const profile = await getCurrentUser(token.accessToken);
            const uuid = nanoid();

            const { userId, fullname, profilePicture, role_keys, permission_keys, customdata, role_details } = profile;
            const { regional = "", witel = "", vendor = "" } = customdata || {};

            const isRememberMe = window.localStorage.getItem("remember-me") ? true : false;

            if (process.env.NODE_ENV === "production") {
                // logEvent(analytic, "mysiis-login", {
                //     userId,
                //     name: fullname,
                //     regional,
                //     witel,
                //     role: role_details?.name ?? "",
                //     roleId: role_details?.roleId ?? "",
                //     platform: "web",
                //     status: "success",
                //     mip: true,
                // });
            }

            // socket.emit("create-session", { userId, uuid });

            await axios.post(isRememberMe ? "/api/login" : "/api/login-temp", {
                userId,
                fullname,
                profilePicture,
                permission_keys,
                role_keys,
                uuid,
                regional,
                witel,
                vendor,
            });

            setCookie(process.env.NEXT_PUBLIC_TOKEN_KEY, token.accessToken, { maxAge: 60 * 60 * 365, sameSite: "strict" });
            setCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY, token.refreshToken, { maxAge: 60 * 60 * 365, sameSite: "strict" });

            setProfile({ ready: true, data: profile });
            router.replace("/fulfillment/odp-view?mip=true");
        } catch (error) {
            if (process.env.NODE_ENV === "production") {
                // logEvent(analytic, "mysiis-login", {
                //     guid,
                //     platform: "web",
                //     status: "error",
                //     mip: true,
                //     error: (error as FetchError)?.message,
                // });
            }

            toast.error((error as FetchError)?.message);
            router.replace("/login");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <Spinner />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    return { props: { token: query.token } };
};

export default LoginMip;

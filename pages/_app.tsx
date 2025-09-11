import "@styles/global.scss";
import { QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
// import { logEvent } from "firebase/analytics";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleTagManager } from '@next/third-parties/google'

// import { analytic, initFirebase } from "@libs/firebase";
import queryClient from "@libs/react-query";
import { initSocket, socket } from "@libs/socket";
import { useProfileStore } from "@libs/store";

import { getCurrentUser } from "@api/account/user";

import { logout } from "@functions/common";

dayjs.locale("id");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.guess();

const MyApp = ({ Component, pageProps }: AppProps<{ user?: User }>) => {
    const token = getCookie(process.env.NEXT_PUBLIC_TOKEN_KEY);
    const profileStore = useProfileStore();
    const router = useRouter();

    const getProfile = async () => {
        try {
            const response = await getCurrentUser(token);
            const { userId, fullname, profilePicture, permission_keys, role_keys, customdata, role_details } = response;
            const { regional = "", witel = "", vendor = "", tsel_region_branch = [] } = customdata || {};

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
                // });
            }

            const rememberMe = window.localStorage.getItem("remember-me");
            const session = await axios.post(rememberMe ? "/api/update" : "/api/update-temp", {
                userId,
                fullname,
                profilePicture,
                permission_keys,
                role_keys,
                regional,
                witel,
                vendor,
                tsel_area: tsel_region_branch.length > 0 ? tsel_region_branch[0]["area"] : "",
                tsel_region: tsel_region_branch.length > 0 ? tsel_region_branch[0]["region"] : "",
                tsel_branch: tsel_region_branch.length > 0 ? tsel_region_branch[0]["branch"] : "",
                tsel_vendor: tsel_region_branch.length > 0 ? tsel_region_branch[0]["vendor"] : "",
            });

            if (session.data.success) {
                profileStore.set({ ready: true, data: response });
            } else {
                logout("/login?message=Sesi anda telah berakhir, silahkan login kembali");
            }
        } catch (error) {
            console.error(error);
            toast.info("Terjadi kesalahan, silahkan login kembali");

            logout();
        }
    };

    useEffect(() => {
        // initFirebase();
        initSocket();

        if (process.env.NODE_ENV === "production") {
            // if (window.location.protocol == "http:") {
            //     router.replace(window.location.href.replace(/^http:/, "https:"));
            //     return;
            // }

            // const log = () => {
            //     logEvent(analytic, "page_view");
            // };

            // router.events.on("routeChangeComplete", log);
            // logEvent(analytic, "page_view");

            // return () => {
            //     router.events.off("routeChangeComplete", log);
            // };
        }
    }, []);

    const idleLogout = () => {
        let timeout: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                logout("/login?message=Sesi anda telah berakhir, silahkan login kembali");
            }, 900000);
        };

        window.onload = resetTimer;
        window.onmousemove = resetTimer;
        window.onmousedown = resetTimer;
        window.ontouchstart = resetTimer;
        window.ontouchmove = resetTimer;
        window.onclick = resetTimer;
        window.onkeydown = resetTimer;
        window.addEventListener("scroll", resetTimer, true);

        resetTimer();
    };

    useEffect(() => {
        if (pageProps.user?.userId && !profileStore.ready) {
            getProfile();
        }

        if (pageProps.user?.userId) {
            idleLogout();
        }
    }, [pageProps.user]);

    useEffect(() => {
        const { userId, uuid } = pageProps.user ?? {};

        if (userId && socket) {
            socket.on(userId, async (data) => {
                if (data?.uuid !== uuid) {
                    logout("/login?message=Akun anda sedang login di perangkat lainnya");
                }
            });
        }
    }, [pageProps.user, socket]);

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <title>MySIIS Web</title>
                <meta name="description" content="MySIIS Versi Web" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta charSet="UTF-8" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            </Head>
            <NextNProgress color="#EA001E" options={{ showSpinner: false }} />
            <Component {...pageProps} />
            <GoogleTagManager gtmId="G-9CWNB2GQ31" />
            <div id="__modal" />
            <ToastContainer hideProgressBar />
        </QueryClientProvider>
    );
};

export default MyApp;

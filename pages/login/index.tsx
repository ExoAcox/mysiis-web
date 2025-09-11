import backgroundImage from "@public/images/background/login/background.png";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { When } from "react-if";
import { toast } from "react-toastify";

import { session } from "@libs/session";

import { AnotherLoginButton, LoginFormWithEmailOrPhoneNumber, LoginHeader } from "@features/login/components";
import { LoginType } from "@features/login/queries/save";

import { Image } from "@components/layout";
import { Line } from "@components/line";
import { Link } from "@components/navigation";
import { Subtitle } from "@components/text";

const LoginFormWithAccessTelkom = dynamic<object>(() => import("@features/login/components").then((mod) => mod.LoginFormWithAccessTelkom));
const LoginFormWithIndihomePartner = dynamic<object>(() => import("@features/login/components").then((mod) => mod.LoginFormWithIndihomePartner));
const LoginFormWithNIK = dynamic<object>(() => import("@features/login/components").then((mod) => mod.LoginFormWithNIK));

const Login = () => {
    const [loginType, setLoginType] = useState(LoginType.EMAIL_OR_PHONE_NUMBER);
    const router = useRouter();

    const handleChangeLoginType = (type: LoginType) => {
        setLoginType(type);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (router.query?.message) {
            toast.error(router.query?.message);
            router.push(router.pathname);
        }
    }, [router.query]);

    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <div className="fixed inset-0 overflow-auto bg-black-20">
                <Head>
                    <title>Login | MySIIS Web</title>
                </Head>
                <div className="flex mx-auto my-16 bg-white shadow-lg max-w-default rounded-3xl xl:shadow-none xl:my-0">
                    <div className="flex justify-center flex-1 px-6 pt-8 pb-16 lg:w-screen">
                        <div className="w-full max-w-[31.25rem]">
                            <LoginHeader type={loginType} />

                            <main className="mt-4">
                                <When condition={loginType === LoginType.EMAIL_OR_PHONE_NUMBER}>
                                    <LoginFormWithEmailOrPhoneNumber />
                                </When>

                                <When condition={loginType === LoginType.NIK}>
                                    <LoginFormWithNIK />
                                </When>

                                <When condition={loginType === LoginType.INDIHOME_PARTNER}>
                                    <LoginFormWithIndihomePartner />
                                </When>

                                <When condition={loginType === LoginType.TELKOM_ACCESS}>
                                    <LoginFormWithAccessTelkom />
                                </When>

                                <div className="flex items-end justify-center gap-1 mt-6">
                                    <Subtitle size="subtitle" className="text-secondary-60">
                                        Belum punya akun?
                                    </Subtitle>
                                    <Link href="/register">
                                        <button className="font-bold text-primary-40">Daftar sekarang</button>
                                    </Link>
                                </div>

                                <div className="flex items-center mt-5 gap-7">
                                    <Line />
                                    <span className="text-black-60">atau</span>
                                    <Line />
                                </div>

                                <AnotherLoginButton currentType={loginType} onChangeType={handleChangeLoginType} />
                            </main>
                        </div>
                    </div>
                    <Image
                        src={backgroundImage}
                        alt="login background"
                        className="object-cover w-full h-screen"
                        parentClassName="flex-1 h-screen rounded-3xl flex-1 sticky top-0 lg:hidden xl:rounded-none"
                    />
                </div>
            </div>
        </GoogleReCaptchaProvider>
    );
};

export const getServerSideProps: GetServerSideProps = session(async ({ req }: any) => {
    const user = req.session.user;
    if (user) {
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
});

export default Login;

import Head from "next/head";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import backgroundImage from "@images/background/forgot-password/background.png";

import { ForgotPasswordForm, ForgotPasswordHeader } from "@features/forgot-password/components";

import { Image } from "@components/layout";

const ForgotPasswordPage = () => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <div className="fixed inset-0 overflow-auto bg-black-20">
                <Head>
                    <title>Forgot Password | MySIIS Web</title>
                </Head>

                <div className="flex mx-auto my-16 bg-white shadow-lg max-w-default rounded-3xl xl:shadow-none xl:my-0">
                    <div className="flex justify-center flex-1 px-6 py-16">
                        <div className="w-full max-w-[31.25rem]">
                            <ForgotPasswordHeader />

                            <main className="mt-4">
                                <ForgotPasswordForm />
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

export default ForgotPasswordPage;

import { GetServerSideProps } from "next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { Header, OTPVerificationForm } from "@features/otp-verification/components";

interface OTPVerificationPageProps {
    email: string;
}

const OTPVerificationPage: React.FC<OTPVerificationPageProps> = ({ email }) => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <Header />

            <OTPVerificationForm email={email} />
        </GoogleReCaptchaProvider>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { email } = context.query;

    if (!email) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            email,
        },
    };
};

export default OTPVerificationPage;

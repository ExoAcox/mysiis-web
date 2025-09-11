import BackgroundImage from "@public/images/background/forgot-password/background.png";
import { GetServerSideProps } from "next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { getServer, session } from "@libs/session";

import { ChangePassword } from "@features/profile/components";

import { Image, Responsive, Wrapper } from "@components/layout";

const ProfileChangePassword: React.FC<{ user: User; access: Access }> = ({ user }) => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            <Wrapper user={user} title="Ubah Password" screenMax backPath="/profile">
                <div className="flex justify-center items-center -mt-[6.25rem] h-screen">
                    <Responsive parentClassName="flex-1" className="w-10/12">
                        <main>
                            <ChangePassword />
                        </main>
                    </Responsive>

                    <Image
                        src={BackgroundImage}
                        alt="login background"
                        className="object-cover w-full h-screen"
                        parentClassName="h-screen flex-1 sticky top-0 md:hidden"
                    />
                </div>
            </Wrapper>
        </GoogleReCaptchaProvider>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context });

    return server;
});

export default ProfileChangePassword;

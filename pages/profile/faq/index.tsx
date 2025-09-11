import { GetServerSideProps } from "next";

import { session, getServer } from "@libs/session";

import { Wrapper, Responsive, Image } from "@components/layout";

import { Faq } from "@features/profile/components";

import BackgroundImage from "@images/background/home_background.jpg";

const ProfileFaq: React.FC<{ user: User; access: Access }> = ({ user }) => {
    return (
        <Wrapper user={user} title="FAQ">
            <Image
                src={BackgroundImage}
                fill
                className="object-cover"
                parentClassName="fixed top-[4.25rem] left-0 right-0 w-full h-full opacity-30"
            />
            <Responsive className="py-6">
                <Faq />
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, guest: true });

    return server;
});

export default ProfileFaq;

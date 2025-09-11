import { GetServerSideProps } from "next";

import { session, getServer } from "@libs/session";

import { Wrapper, Responsive, Image } from "@components/layout";

import { TermsCondition } from "@features/profile/components";

import BackgroundImage from "@images/background/home_background.jpg";

const ProfileTermsCondition: React.FC<{ user: User; access: Access }> = ({ user }) => {
    return (
        <Wrapper user={user} title="Terms & Condition" backPath="/profile">
            <Image
                src={BackgroundImage}
                fill
                className="object-cover"
                parentClassName="fixed top-[4.25rem] left-0 right-0 w-full h-full opacity-30"
            />
            <Responsive className="py-12">
                <TermsCondition />
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context });

    return server;
});

export default ProfileTermsCondition;

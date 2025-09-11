import { GetServerSideProps } from "next";

import { getServer, session } from "@libs/session";

import BackgroundImage from "@images/background/home_background.jpg";

import { Point } from "@features/profile/components";

import { Image, Responsive, Wrapper } from "@components/layout";

const ProfilePoint: React.FC<{ user: User; access: Access }> = ({ user }) => {
    return (
        <Wrapper user={user} title="Poin" footer>
            <Image
                src={BackgroundImage}
                fill
                className="object-cover"
                parentClassName="fixed top-[4.25rem] left-0 right-0 w-screen h-full opacity-30"
            />
            <Responsive className="pt-6 pb-24">
                <Point user={user} />
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context });

    return server;
});

export default ProfilePoint;

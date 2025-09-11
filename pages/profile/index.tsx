import { GetServerSideProps } from "next";

import { session, getServer } from "@libs/session";

import { Wrapper, Responsive, Image } from "@components/layout";

import { Main } from "@features/profile/components";

import BackgroundImage from "@images/background/home_background.jpg";

const Profile: React.FC<{ user: User; access: Access }> = ({ user }) => {
    return (
        <Wrapper user={user} title="Profil Saya" footer>
            <Image
                src={BackgroundImage}
                fill
                className="object-cover"
                parentClassName="fixed top-[4.25rem] left-0 right-0 w-screen h-full opacity-30"
            />
            <Responsive className="pt-6 pb-24">
                <Main user={user} />
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context });

    return server;
});

export default Profile;

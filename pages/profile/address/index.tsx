import { GetServerSideProps } from "next";

import { session, getServer } from "@libs/session";

import { Wrapper, Responsive, Image } from "@components/layout";

import { Address } from "@features/profile/components";

import BackgroundImage from "@public/images/background/login/background.png";

const ProfileAddress: React.FC<{ user: User; access: Access }> = ({ user, access }) => {
    return (
        <Wrapper user={user} title="Alamat" screenMax backPath="/profile">
            <div className="flex justify-center items-center -mt-[6.25rem] h-screen overflow-hidden">
                <Responsive parentClassName="flex-1 h-full overflow-auto scrollbar-hidden" className="w-10/12 mt-[6.25rem] py-8">
                    <main>
                        <Address access={access} />
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
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context });

    return server;
});

export default ProfileAddress;

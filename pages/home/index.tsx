import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { getServer, session } from "@libs/session";

import BackgroundImage from "@images/background/home_background.jpg";

import { Banner, Main, News } from "@features/home/components";

import { Image, Responsive, Wrapper } from "@components/layout";

interface Home {
    user: User;
    device: Device;
}

const Home: React.FC<Home> = ({ user, device }) => {
    const router = useRouter();

    useEffect(() => {
        if (router.query?.unauthorized === "") {
            router.push("/", undefined, { shallow: true });
            toast.error("Akun anda tidak punya akses ke portofolio tersebut.");
        }
    }, [router.query]);

    return (
        <Wrapper user={user} device={device} hideBack footer>
            <Image
                src={BackgroundImage}
                fill
                className="object-cover"
                parentClassName="fixed top-[4.25rem] left-0 right-0 w-screen h-full opacity-30"
            />
            <Responsive className="pt-6 pb-24 sm:py-0">
                <Banner />
                <Main device={device} user={user} />
                <News device={device} />
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, guest: true });

    return server;
});

export default Home;

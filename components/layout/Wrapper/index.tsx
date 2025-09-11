import Head from "next/head";
import { Unless, When } from "react-if";

import { tw } from "@functions/style";

import { NavigationBar } from "@components/navigation";
import { Tab } from "@components/navigation/NavigationBar";

import { Footer, LiveChat, NpsModal } from "./components";

interface Props {
    children: React.ReactNode;
    user: User;
    device?: Device;
    title?: string;
    pageTitle?: string;
    className?: string;
    centered?: boolean;
    footer?: boolean;
    screenMax?: boolean;
    tab?: Tab;
    backPath?: string;
    hideBack?: boolean;
    fullscreen?: boolean;
}

const Wrapper: React.FC<Props> = ({
    user,
    device,
    children,
    title,
    pageTitle,
    className,
    centered,
    footer,
    tab,
    screenMax,
    backPath,
    hideBack,
    fullscreen,
}) => {
    return (
        <div className={tw("h-screen max-w-screen flex flex-col")}>
            <Head>
                <title>{pageTitle || title ? `${pageTitle || title} | MySIIS Web` : "MySIIS Web"}</title>
            </Head>
            <Unless condition={fullscreen}>
                <NavigationBar user={user} screenMax={screenMax} tab={tab} title={title} device={device} backPath={backPath} hideBack={hideBack} />
            </Unless>

            <main
                className={tw("relative flex-1 bg-background min-w-[360px] overflow-auto", centered && "flex items-center justify-center", className)}
            >
                {children}
                <When condition={footer}>
                    <Footer />
                </When>
            </main>

            {/* <LiveChat /> */}

            <NpsModal user={user} />
        </div>
    );
};

export default Wrapper;

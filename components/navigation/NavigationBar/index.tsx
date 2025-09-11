import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { When } from "react-if";
import ReactTooltip from "react-tooltip";

import { useNotificationStore } from "@libs/store";

import useModal from "@hooks/useModal";

import { fetchNotification } from "@functions/notification";
import { tw } from "@functions/style";

import ChevronIcon from "@images/vector/chevron.svg";
import LogoutIcon from "@images/vector/logout.svg";
import MySiisLogo from "@images/vector/mysiis.svg";

import { Button } from "@components/button";
import { Responsive } from "@components/layout";
import { Spinner } from "@components/loader";
import { Link } from "@components/navigation";
import { Title } from "@components/text";

import { DownloadApp, Logout, Profile, TabBar, TopBar } from "./components";

export interface Tab {
    value: string;
    onChange: (value: string, data: object) => void;
    options: Option<string>[];
}

export interface NavigationProps {
    user: User;
    title?: string;
    device?: Device;
    screenMax?: boolean;
    tab?: Tab;
    backPath?: string;
    hideBack?: boolean;
}

const NavigationBar: React.FC<NavigationProps> = ({ user, title, screenMax, tab, backPath, hideBack }) => {
    const { modal: isLogoutOpen, setModal: setLogoutOpen } = useModal("logout");
    const [isDownloadAppOpen, setDownloadAppOpen] = useState(false);

    const router = useRouter();

    const notificationStore = useNotificationStore();

    useEffect(() => {
        if (user.userId && notificationStore.status === "idle") fetchNotification(user.userId);
    }, []);

    return (
        <div className="sticky top-0 left-0 right-0 z-50 bg-white">
            <TopBar screenMax={screenMax} setDownloadAppOpen={setDownloadAppOpen} />
            <Responsive
                className={tw("flex items-center w-full gap-6 mx-auto font-semibold sm:gap-4", screenMax && "max-w-none")}
                parentClassName="h-[4.25rem] flex item-center shadow relative z-[2] md:h-[3.5rem]"
            >
                <div className="flex items-center mr-auto">
                    <Link href="/" className="sm:hidden">
                        <MySiisLogo className="w-[92px] h-10" />
                    </Link>
                    <When condition={title}>
                        <div className="h-10 w-[1px] bg-secondary-20 ml-4 mr-5 sm:hidden" />
                        <When condition={!hideBack}>
                            <ChevronIcon
                                className="mr-5 sm:-translate-y-[1px] sm:mr-4 cursor-pointer"
                                onClick={() => {
                                    if (backPath) {
                                        router.push(backPath);
                                    } else {
                                        router.push("/");
                                    }
                                }}
                            />
                        </When>

                        <Title size="h5" className="text-black-100 sm:text-large">
                            {title}
                        </Title>
                    </When>
                </div>

                <When condition={user.userId}>
                    <div className="flex gap-4 md:hidden">
                        <Profile user={user} />
                    </div>
                    <LogoutIcon className="w-5 h-5 cursor-pointer shrink-0 md:hidden" data-tip="Logout" onClick={() => setLogoutOpen(true)} />
                    <BsThreeDotsVertical
                        className="hidden w-5 h-5 cursor-pointer md:block"
                        onClick={() => {
                            router.push("/profile/m");
                        }}
                    />
                    <ReactTooltip />
                </When>
                <When condition={!user.userId}>
                    <Link href="/login" className="font-bold text-primary-40">
                        <Button className="px-6 text-medium">Login</Button>
                    </Link>
                </When>
            </Responsive>

            <When condition={!!tab}>
                <TabBar tab={tab!} screenMax={screenMax} />
            </When>

            <DownloadApp visible={isDownloadAppOpen} close={() => setDownloadAppOpen(false)} screenMax={screenMax} />
            <Logout visible={isLogoutOpen} close={() => setLogoutOpen(false)} />
            {/* <NotificationModal /> */}
        </div>
    );
};

export default NavigationBar;

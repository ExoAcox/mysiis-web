import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    device?: Device;
    portofolio: Portofolio;
    user: User;
}

const MainMenu: React.FC<Props> = ({ user, device, portofolio }) => {
    return (
        <If condition={device === "mobile"}>
            <Then>
                <Mobile portofolio={portofolio} user={user} />
            </Then>
            <Else>
                <Desktop portofolio={portofolio} user={user} />
            </Else>
        </If>
    );
};

export default MainMenu;

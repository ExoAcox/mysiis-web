import dynamic from "next/dynamic";
import { Else, If, Then } from "react-if";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    user: User;
    device: Device;
}

const MainMenu: React.FC<Props> = ({ user, device }) => {
    return (
        <If condition={device === "mobile"}>
            <Then>
                <Mobile user={user} />
            </Then>
            <Else>
                <Desktop user={user} />
            </Else>
        </If>
    );
};

export default MainMenu;

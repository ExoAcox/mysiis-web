import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./desktop"));

export interface Props {
    device: Device;
    user: User;
}

const SurveyorFilter: React.FC<Props> = ({ user, device }) => {
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

export default SurveyorFilter;

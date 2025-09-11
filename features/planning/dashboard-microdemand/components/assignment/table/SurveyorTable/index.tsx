import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    user: User;
    device: Device;
}

const SurveyorTable: React.FC<Props> = (props) => {
    return (
        <If condition={props.device === "mobile"}>
            <Then>
                <Desktop user={props.user} />
            </Then>
            <Else>
                <Desktop user={props.user} />
            </Else>
        </If>
    );
};

export default SurveyorTable;

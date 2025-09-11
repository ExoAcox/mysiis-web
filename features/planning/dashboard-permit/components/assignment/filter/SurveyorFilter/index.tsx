import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    device: Device;
}

const SurveyorFilter: React.FC<Props> = (props) => {
    return (
        <If condition={props.device === "mobile"}>
            <Then>
                <Mobile />
            </Then>
            <Else>
                <Desktop />
            </Else>
        </If>
    );
};

export default SurveyorFilter;

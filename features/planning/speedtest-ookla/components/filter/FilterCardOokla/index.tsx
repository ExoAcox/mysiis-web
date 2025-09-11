import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    access: Access;
    mapState: MapState;
    device: Device;
}

const FilterCardOokla: React.FC<Props> = (props) => {
    return (
        <If condition={props.device === "mobile"}>
            <Then>
                <Mobile {...props} />
            </Then>
            <Else>
                <Desktop {...props} />
            </Else>
        </If>
    );
};

export default FilterCardOokla;

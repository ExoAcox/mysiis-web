import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

const OdpCard: React.FC<{ device: Device }> = ({ device }) => {
    return (
        <If condition={device === "mobile"}>
            <Then>
                <Mobile />
            </Then>
            <Else>
                <Desktop />
            </Else>
        </If>
    );
};

export default OdpCard;

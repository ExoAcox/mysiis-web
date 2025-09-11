import dynamic from "next/dynamic";
import React, { RefObject } from "react";
import { Else, If, Then } from "react-if";

import { SheetRef } from "@components/navigation/BottomSheet";

interface Props {
    access: Access;
    mapState: MapState;
    device: Device;
    sheetRef?: RefObject<SheetRef>;
}

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

const InfoCard: React.FC<Props> = (props) => {
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

export default InfoCard;

import dynamic from "next/dynamic";
import { RefObject } from "react";
import { Else, If, Then } from "react-if";

import { SheetRef } from "@components/navigation/BottomSheet";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface DistrictOdpProps {
    device: Device;
    mapState: MapState;
    className?: string;
    sheetRef?: RefObject<SheetRef>;
}

export default function index(props: DistrictOdpProps) {
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
}

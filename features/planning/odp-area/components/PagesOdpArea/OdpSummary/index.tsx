import dynamic from "next/dynamic";
import { RefObject } from "react";
import { Else, If, Then } from "react-if";
import { SheetRef } from "@components/navigation/BottomSheet";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface OdpSummaryProps {
    device: Device;
    mapState: MapState;
    sheetRef?: RefObject<SheetRef>;
    onResultClick: (latLng: LatLng) => void;
}

export default function index(props: OdpSummaryProps) {
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

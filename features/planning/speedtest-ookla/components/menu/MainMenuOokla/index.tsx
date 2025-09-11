import dynamic from "next/dynamic";
import { RefObject } from "react";
import { Else, If, Then } from "react-if";

import { SheetRef } from "@components/navigation/BottomSheet";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    access: Access;
    mapState: MapState;
    device: Device;
    sheetRef?: RefObject<SheetRef>;
}

const MainMenuOokla: React.FC<Props> = (props) => {
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

export default MainMenuOokla;

import dynamic from "next/dynamic";
import { RefObject } from "react";
import { Else, If, Then } from "react-if";

import { SheetRef } from "@components/navigation/BottomSheet";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Props {
    access: Access;
    device: Device;
    mapState: MapState;
    sheetRef?: RefObject<SheetRef>;
}

const MainMenu: React.FC<Props> = (props) => {
    return (
        <div data-testid="test">
            <If condition={props.device === "mobile"}>
                <Then>
                    <Mobile {...props} />
                </Then>
                <Else>
                    <Desktop {...props} />
                </Else>
            </If>
        </div>
    );
};

export default MainMenu;

import dynamic from "next/dynamic";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Else, If, Then } from "react-if";

import { SheetRef } from "@components/navigation/BottomSheet";

const Desktop = dynamic(() => import("./desktop"));
const Mobile = dynamic(() => import("./mobile"));

export interface Value {
    value?: string;
    kota?: string;
    lat?: number;
    long?: number;
    provinsi?: string;
}

interface Input {
    provinsi?: string;
    kota?: Value;
}

export interface Props {
    input: Input;
    setInput: Dispatch<SetStateAction<Input>>;
    access: Access;
    mapState: MapState;
    device: Device;
    sheetRef: RefObject<SheetRef>;
}

const MainMenuAgregat: React.FC<Props> = (props) => {
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

export default MainMenuAgregat;

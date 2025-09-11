import { Dispatch, SetStateAction } from "react";
import { If, Then, Else } from "react-if";

import dynamic from "next/dynamic";

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
    device: Device;
}

const FilterCardAgregat: React.FC<Props> = (props) => {
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

export default FilterCardAgregat;

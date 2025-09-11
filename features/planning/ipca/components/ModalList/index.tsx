import dynamic from "next/dynamic";
import { Else, If, Then } from "react-if";

const Desktop = dynamic(() => import("./desktop"));

const ModalList: React.FC<{ device: Device }> = ({ device }) => {
    return (
        <If condition={device === "mobile"}>
            <Then></Then>
            <Else>
                <Desktop />
            </Else>
        </If>
    );
};

export default ModalList;

import { FloatingMenu } from "@components/layout";
import { Card } from "@components/maps";

import { Props } from ".";
import { FilterAgregat, InfoAgregat } from "../../card";

const MainMenuAgregat: React.FC<Props> = (props) => {
    return (
        <>
            <FloatingMenu className="w-[21rem]">
                <Card className="z-40">
                    <FilterAgregat {...props} />
                </Card>
                <InfoAgregat {...props} />
            </FloatingMenu>
        </>
    );
};

export default MainMenuAgregat;

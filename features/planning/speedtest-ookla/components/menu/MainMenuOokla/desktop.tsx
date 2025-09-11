import { FloatingMenu } from "@components/layout";
import { Card } from "@components/maps";

import { Props } from ".";
import { FilterOokla, InfoOokla, ListOokla } from "../../card";

const MainMenuOokla: React.FC<Props> = (props) => {
    return (
        <>
            <FloatingMenu className="w-[21rem]">
                <Card className="z-40">
                    <FilterOokla {...props} />
                </Card>
                <InfoOokla {...props} />
                <ListOokla {...props} />
            </FloatingMenu>
        </>
    );
};

export default MainMenuOokla;

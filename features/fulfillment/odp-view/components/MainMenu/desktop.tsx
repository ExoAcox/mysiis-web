import { When } from "react-if";

import { FloatingMenu } from "@components/layout";

import { Props } from ".";
import { useFilterStore } from "../../store";
import { ClusterInfo, FilterCard, InformationCard, SmartSalesInfo } from "../index";

const MainMenu: React.FC<Props> = (props) => {
    const filterStore = useFilterStore();
    const { smartsales, ipca_cluster } = filterStore;

    return (
        <>
            <FloatingMenu className="w-[21rem]">
                <FilterCard {...props} />
                <InformationCard {...props} />
            </FloatingMenu>
            <div className="absolute flex gap-3 bottom-5.5 left-1/2 -translate-x-1/2 hover:z-[2]">
                <When condition={smartsales}>
                    <div className="border shadow rounded-xl border-secondary-20">
                        <SmartSalesInfo />
                    </div>
                </When>
                <When condition={ipca_cluster}>
                    <div className="border shadow rounded-xl border-secondary-20">
                        <ClusterInfo />
                    </div>
                </When>
            </div>
        </>
    );
};

export default MainMenu;

import { useState } from "react";
import { HiOutlineMap } from "react-icons/hi";
import { When } from "react-if";

import { googleMaps } from "@pages/fulfillment/odp-view";

import { BottomSheet } from "@components/navigation";

import { Props } from ".";
import { useFilterStore } from "../../store";
import { ClusterInfo, InformationCard, SmartSalesInfo } from "../index";

const MainMenu: React.FC<Props> = (props) => {
    const filterStore = useFilterStore();
    const { smartsales, ipca_cluster } = filterStore;

    const [mapType, setMapType] = useState("roadmap");

    return (
        <BottomSheet ref={props.sheetRef} defaultSnap="max" snapPoints={({ minHeight }) => [20, 100, minHeight]}>
            <div
                className="absolute top-0 -translate-y-[120%] right-2.5 bg-white w-12 h-12 rounded-full shadow cursor-pointer flex items-center justify-center"
                onClick={() => {
                    const type = mapType === "roadmap" ? "hybrid" : "roadmap";
                    setMapType(type);
                    googleMaps.setMapTypeId(type);
                }}
            >
                <HiOutlineMap size="1.5rem" title="maps-type" />
            </div>
            <When condition={smartsales}>
                <div className="px-3">
                    <SmartSalesInfo className="border-b rounded-none border-secondary-20" />
                </div>
            </When>
            <When condition={ipca_cluster}>
                <div className="px-3">
                    <ClusterInfo className="border-b rounded-none border-secondary-20" />
                </div>
            </When>
            <InformationCard {...props} />
        </BottomSheet>
    );
};

export default MainMenu;

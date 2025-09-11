import { useState } from "react";
import { HiOutlineMap } from "react-icons/hi";
import { BottomSheet } from "@components/navigation";

import { Props } from ".";
import { InfoAgregat } from "../../card";
import { googleMaps } from "@pages/planning/speedtest-ookla/agregat-speedtest";

const MainMenuAgregat: React.FC<Props> = (props) => {
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
                <HiOutlineMap title="map-type-icon" size="1.5rem" />
            </div>
            <InfoAgregat {...props} />
        </BottomSheet>
    );
};

export default MainMenuAgregat;

import { useState } from "react";
import { HiOutlineMap } from "react-icons/hi";
import { BottomSheet } from "@components/navigation";
import { googleMaps } from "@pages/planning/speedtest-ookla/speedtest-ookla";

import { Props } from ".";
import { InfoOokla, ListOokla } from "../../card";

const MainMenuOokla: React.FC<Props> = (props) => {
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
            <InfoOokla {...props} />
            <ListOokla {...props} />
        </BottomSheet>
    );
};

export default MainMenuOokla;

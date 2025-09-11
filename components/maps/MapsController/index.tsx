import { useState, useEffect, useRef } from "react";
import { When } from "react-if";
import { eventListener } from "./functions/event";

import { tw } from "@functions/style";

import useOverlay from "@hooks/useOverlay";
import { useMapsSearchBoxStore } from "@libs/store";

import { MdSearch } from "react-icons/md";
import { RiFullscreenFill } from "react-icons/ri";

import { Button, TabButton } from "@components/button";
import { ResultList } from "./components";

export interface MapsControllerProps {
    access?: Access;
    searchBox?: boolean;
    mapType?: boolean;
    fullscreen?: boolean;
    device?: Device;
    className?: string;
    onResultClick?: (latLng: LatLng) => void;
    onFocus?: () => void;
}

let googleMaps: Maps;

export const mapsController = (mapsIntance: Maps) => {
    googleMaps = mapsIntance;
};

const MapsController = (props: MapsControllerProps) => {
    const { access, searchBox, mapType, fullscreen, device, className, onFocus } = props;

    const searchStore = useMapsSearchBoxStore();
    const searchBoxRef = useRef<HTMLInputElement>(null);
    const [source] = useState("tmaps");
    const [mapTypeSelected, setMapType] = useState("roadmap");

    const [isSearchFocus, setSearchFocus] = useOverlay("#maps-searchbox");

    const isMobile = device === "mobile";

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google && googleMaps) {
                clearInterval(interval);
                eventListener({ ...props, googleMaps, searchBoxRef });
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (!searchBox) return;

        if (!isSearchFocus && searchStore.status !== "idle") {
            searchBoxRef.current!.value = "";
            searchStore.set({ data: [], status: "idle", error: null });
        }

        if (onFocus && isSearchFocus) onFocus();
    }, [isSearchFocus]);

    useEffect(() => {
        if (isSearchFocus && searchStore.status === "idle") {
            setSearchFocus(false);
        }
    }, [searchStore.status]);

    useEffect(() => {
        if (!searchBox) return;

        // searchBoxRef.current!.value = "";
        searchStore.set({ data: [], status: "idle", error: null });
    }, [source]);

    useEffect(() => {
        return searchStore.reset();
    }, []);

    return (
        <div
            className={tw(
                "flex gap-3 absolute z-[2] pointer-events-through",
                isMobile ? "relative w-full gap-0" : "top-3 right-3 lg:flex-col",
                className
            )}
        >
            <When condition={searchBox}>
                <div id="maps-searchbox" className="relative w-full">
                    <form
                        id="maps-searchbox-form"
                        data-testid="maps-searchbox-form"
                        className={tw(
                            "flex bg-white items-center py-1 h-12 rounded-lg w-[40vw] max-w-[30rem] min-w-[22.5rem] shadow",
                            isMobile && "min-w-0 w-full h-10 max-w-none"
                        )}
                    >
                        <span id="maps-searchbox-source" data-source={source} className="p-3.5 text-medium text-black-100 font-semibold">
                            TiMaps
                        </span>
                        <input
                            id="maps-searchbox-input"
                            aria-label="maps-searchbox-input"
                            ref={searchBoxRef}
                            placeholder="Cari Lokasi"
                            className={"w-full p-2 border-l focus:outline-none sm:text-medium"}
                            autoComplete="off"
                            onClick={() => {
                                setSearchFocus(true);
                            }}
                        />
                        <button disabled={access === "unauthorized"}>
                            <MdSearch className="min-w-[1.5rem] min-h-[1.5rem] mr-3" />
                        </button>
                    </form>
                    <ResultList results={searchStore} source={source} isFocus={isSearchFocus} access={access} />
                </div>
            </When>
            <div className="flex gap-3 ml-auto w-fit">
                <When condition={mapType}>
                    <div>
                        <button id="maps-searchbox-type" data-type={mapType} className="absolute" />
                        <TabButton
                            value={mapTypeSelected}
                            options={[
                                { label: "Map", value: "roadmap" },
                                { label: "Satellite", value: "hybrid" },
                            ]}
                            onChange={(value) => {
                                setMapType(value);

                                const element = document.getElementById("maps-searchbox-type");
                                element!.dataset.type = value;
                                element!.click();
                            }}
                            className="text-large"
                            parentClassName="h-12 w-[10.25rem] shadow"
                        />
                    </div>
                </When>
                <When condition={fullscreen}>
                    <Button
                        variant="nude"
                        className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow text-black-100"
                        onClick={() => {
                            const container = document.getElementById("maps-container")?.parentElement;
                            if (document.fullscreenElement) {
                                document.exitFullscreen();
                            } else {
                                container?.requestFullscreen();
                            }
                        }}
                    >
                        <RiFullscreenFill size="1.75rem" />
                    </Button>
                </When>
            </div>
        </div>
    );
};

MapsController.defaultProps = {
    searchBox: true,
    mapType: true,
    fullscreen: true,
};

export default MapsController;

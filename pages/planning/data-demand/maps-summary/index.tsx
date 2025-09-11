import MarkerClusterer from "@googlemaps/markerclustererplus";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { HiOutlineMap } from "react-icons/hi";
import { When } from "react-if";

import { getServer, session } from "@libs/session";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import { createMap } from "@functions/maps";

import Filter from "@images/vector/filter.svg";

import { FilterCard, InformationCard } from "@features/planning/data-demand/components/maps";
import { DataRespondentMapsModal, FilterMapsMobileModal } from "@features/planning/data-demand/components/modal";
import { tabOptions } from "@features/planning/data-demand/functions/common";
import { onMouseOverCluster } from "@features/planning/data-demand/functions/maps";
import { fetchKelurahan } from "@features/planning/data-demand/queries/maps";
import { useFilterStore, useKelurahanStore, useRespondentStore } from "@features/planning/data-demand/store/maps";

import { Button } from "@components/button";
import { FloatingMenu, Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { BottomSheet } from "@components/navigation";
import { SheetRef } from "@components/navigation/BottomSheet";

export let googleMaps: Maps;
export let circleRadius: Circle;
export let markerPin: Marker;
export let infoWindowDemand: InfoWindow;
export const markerDemands: Marker[] = [];
export const markerOdps: Marker[] = [];
export let clusterDemands: MarkerClusterer;
export let polygonBoundary: Polygon;
export let polylineDirection: Polyline;

const DataDemand: React.FC<{ user: User; access: Access; device: Device }> = ({ user, access, device }) => {
    const kelurahanStore = useKelurahanStore();
    const respondentStore = useRespondentStore();
    const filterStore = useFilterStore();
    const { period } = filterStore;

    const router = useRouter();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const sheetRef = useRef<SheetRef>(null);
    const [mapType, setMapType] = useState("roadmap");

    const modalFilterMapsMobile = useModal("modal-data-demand-maps-filter-mobile");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    const initialize = () => {
        googleMaps = createMap(mapRef.current!, {
            zoomControl: device === "mobile" ? false : true,
        });

        markerPin = new window.google.maps.Marker({
            map: googleMaps,
            zIndex: 10,
        });

        circleRadius = new window.google.maps.Circle({
            map: googleMaps,
            strokeColor: "#FF0000",
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: "#FF0000",
            fillOpacity: 0.2,
            zIndex: 2,
        });

        polygonBoundary = new window.google.maps.Polygon({
            map: googleMaps,
            strokeWeight: 3,
            strokeColor: "#388e3c",
            fillColor: "#FF0000",
            fillOpacity: 0.2,
            zIndex: 4,
        });

        polylineDirection = new window.google.maps.Polyline({
            map: googleMaps,
            geodesic: true,
            strokeColor: "#039BE5",
            strokeOpacity: 0.75,
            strokeWeight: 7,
        });

        infoWindowDemand = new window.google.maps.InfoWindow({ pixelOffset: new window.google.maps.Size(0, -20) });

        clusterDemands = new MarkerClusterer(googleMaps, [], {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            minimumClusterSize: 1,
            maxZoom: 17,
        });

        googleMaps.addListener("click", (e: MapMouseEvent) => {
            resetData();
            fetchKelurahan({ latLng: { lat: e.latLng!.lat(), lng: e.latLng!.lng() }, period: mapState().period! }, access);
        });

        googleMaps.addListener("zoom_changed", () => {
            infoWindowDemand.close();
        });

        window.google.maps.event.addListener(clusterDemands, "mouseover", onMouseOverCluster);

        mapsController(googleMaps);
    };

    const resetData = () => {
        kelurahanStore.reset();
        respondentStore.reset();
    };

    useEffect(() => {
        return () => {
            resetData();
            filterStore.reset();
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            sheetRef.current?.snapTo("max");
        }, 1000);
    }, [respondentStore.status]);

    return (
        <Wrapper
            user={user}
            title="Data Demand"
            screenMax
            tab={{
                value: "maps-summary",
                options: tabOptions,
                onChange: (value) => {
                    router.push(`/planning/data-demand/${value}`);
                },
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <GoogleMaps
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_DATA_DEMAND}
                    onInit={initialize}
                    mapRef={mapRef}
                    state={{
                        "data-period": period,
                    }}
                />
                <div className="absolute top-0 flex items-center w-full gap-2 p-2">
                    <MapsController
                        access={access}
                        mapType={isMobile ? false : true}
                        fullscreen={isMobile ? false : true}
                        device={isMobile ? "mobile" : "desktop"}
                        onResultClick={(latLng) => {
                            resetData();
                            fetchKelurahan({ latLng, period: mapState().period! }, access);
                        }}
                        onFocus={() => {
                            sheetRef.current?.snapTo(20);
                        }}
                    />
                    <When condition={isMobile}>
                        <Button
                            onClick={() => modalFilterMapsMobile.setModal(true)}
                            className="flex py-2.5 text-sm w-fit"
                            labelClassName="gap-2"
                            variant="ghost"
                        >
                            <Filter />
                            Filter
                        </Button>
                    </When>
                </div>
                <FloatingMenu className="w-[22.875rem] z-[1]">
                    <div
                        className="flex flex-col gap-3 overflow-auto scrollbar-hidden sm:mt-[3.8rem]"
                        style={{ height: isMobile ? "fit-content" : "100%" }}
                    >
                        <When condition={!isMobile}>
                            <FilterCard access={access} />
                            <InformationCard />
                        </When>
                    </div>
                </FloatingMenu>
                <When condition={isMobile}>
                    <BottomSheet ref={sheetRef} defaultSnap="max" snapPoints={({ minHeight }) => [20, 100, minHeight]}>
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
                        <InformationCard />
                    </BottomSheet>
                </When>
            </div>
            <DataRespondentMapsModal />
            <FilterMapsMobileModal access={access} />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["data-demand"],
    });

    return server;
});

export default DataDemand;

import Filter from "@public/images/vector/filter.svg";
// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { Else, If, Then } from "react-if";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import useModal from "@hooks/useModal";
import useProfile from "@hooks/useProfile";

import { createMap } from "@functions/maps";
import { tw } from "@functions/style";

import { tabOptionsOdpArea } from "@features/planning/odp-area/Functions";
import ModalInfo from "@features/planning/odp-area/components/Mobile/OdpSummary/ModalInfo";
import PageInfo from "@features/planning/odp-area/components/PageInfo";
import OdpSummary from "@features/planning/odp-area/components/PagesOdpArea/OdpSummary";
import { clearDataOdpSummary, fetchDataOdpSummary } from "@features/planning/odp-area/queries/OdpSummary";
import { useSource } from "@features/planning/odp-area/store";

import { Button } from "@components/button";
import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";
import { TabBar } from "@components/navigation/NavigationBar/components";

import { OdpAreaProps } from "..";

export let googleMapsOdpShummary: Maps;
export let mainMarkerOdpAreaOdpSummary: Marker;
export let polygonKelurahanOdpAreaOdpSummary: Polygon;
export const odpAreaMarkersOdpSumaary: Marker[] = [];
export const odpAreaPolygonsOdpSumaary: Polygon[] = [];
export const odpAreaInfoWindowsOdpSumaary: InfoWindow[] = [];
export const heatmapOdpAreaOdpSummary: HeatmapLayer[] = [];

const OdpSummaryPage = ({ user, device }: OdpAreaProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<SheetRef>(null);

    const profile = useProfile();

    const [sourceStore, setSource] = useSource((state) => [state.source, state.setSource]);

    const router = useRouter();
    const mapState: MapState = () => mapRef.current!.dataset;

    const { setModal: setModalDetail } = useModal("modal-info-odp-summary");

    const initialize = () => {
        googleMapsOdpShummary = createMap(mapRef.current!, {
            zoomControl: device === "mobile" ? false : true,
        });

        mainMarkerOdpAreaOdpSummary = new window.google.maps.Marker({
            map: googleMapsOdpShummary,
            zIndex: 10,
        });

        polygonKelurahanOdpAreaOdpSummary = new window.google.maps.Polygon({
            map: googleMapsOdpShummary,
            paths: [],
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
        });

        googleMapsOdpShummary.addListener("click", (e: MapMouseEvent) => {
            const latLng = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
            fetchDataOdpSummary(latLng, mapState().source);
            mainMarkerOdpAreaOdpSummary.setMap(googleMapsOdpShummary);
        });

        mapsController(googleMapsOdpShummary);
    };

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_odp_area_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    return (
        <Wrapper user={user} title="ODP Area" className="overflow-hidden" screenMax>
            <div className="flex flex-col h-full">
                <div className="w-full">
                    <TabBar
                        screenMax
                        parentClassName="w-full gap-0 pl-[135px]"
                        wrapperClassName="w-[150px] flex items-center justify-center bg-white"
                        tab={{
                            value: "odp-summary",
                            options: tabOptionsOdpArea,
                            onChange: (value) => {
                                router.push("/planning/odp-area/" + value);
                                setSource(value);
                                clearDataOdpSummary();
                            },
                        }}
                    />
                    <PageInfo className={tw("w-full text-[13px]", device == "mobile" ? "py-1 px-3 inline-block h-auto" : "py-5")}>
                        Menampilkan summary keterisian port perkelurahan dengan kabupaten atau kota
                    </PageInfo>
                </div>
                <div className="relative flex-1">
                    <GoogleMaps
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_ODP_AREA}
                        onInit={initialize}
                        mapRef={mapRef}
                        state={{
                            "data-source": sourceStore,
                        }}
                    />
                    <If condition={device === "mobile"}>
                        <Then>
                            <div className="absolute top-0 flex items-center w-full gap-2 p-2">
                                <MapsController
                                    mapType={false}
                                    fullscreen={false}
                                    device={device}
                                    onResultClick={(latLng) => {
                                        fetchDataOdpSummary(latLng, mapState().source);
                                    }}
                                    onFocus={() => {
                                        sheetRef.current!.snapTo(20);
                                    }}
                                />
                                <Button variant="ghost" onClick={() => setModalDetail(true)}>
                                    <Filter />
                                    Filter
                                </Button>
                            </div>
                        </Then>
                        <Else>
                            <MapsController
                                onResultClick={(latLng) => {
                                    fetchDataOdpSummary(latLng, mapState().source);
                                }}
                            />
                        </Else>
                    </If>
                    <OdpSummary
                        sheetRef={sheetRef}
                        mapState={mapState}
                        onResultClick={(latLng) => {
                            fetchDataOdpSummary(latLng, mapState().source);
                        }}
                        device={device}
                    />
                </div>
            </div>
            <ModalInfo />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["district-data"],
    });

    return server;
});

export default OdpSummaryPage;

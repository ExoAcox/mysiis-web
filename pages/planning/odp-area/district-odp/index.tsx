import Filter from "@public/images/vector/filter.svg";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { Else, If, Then } from "react-if";

import { getServer, session } from "@libs/session";

import { SummaryPenetration } from "@api/district/summary";

import useModal from "@hooks/useModal";

import { createMap } from "@functions/maps";
import { tw } from "@functions/style";

import { tabOptionsOdpArea } from "@features/planning/odp-area/Functions";
import ModalFilter from "@features/planning/odp-area/components/Mobile/DistrictOdp/ModalFIlter";
import ModalDistrictOdp from "@features/planning/odp-area/components/ModalDistrictOdp";
import PageInfo from "@features/planning/odp-area/components/PageInfo";
import DistrictOdp from "@features/planning/odp-area/components/PagesOdpArea/DistrictOdp";
import { clearDataDistrictOdp, fetchKelurahanByLocation } from "@features/planning/odp-area/queries/DistrictOdp";
import { useDistrictOdpSummaryStore, useSource } from "@features/planning/odp-area/store";

import { Button } from "@components/button";
import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";
import { TabBar } from "@components/navigation/NavigationBar/components";

import { OdpAreaProps } from "..";

export let googleMapsDistrictOdp: Maps;
export let mainMarkerOdpAreaDistrictOdp: Marker;
export let polygonKelurahanOdpAreaDistrictOdp: Polygon;
export const odpAreaMarkersDistrictOdp: Marker[] = [];
export const odpAreaPolygonsDistrictOdp: Polygon[] = [];
export const odpAreaInfoWindowsDistrictOdp: InfoWindow[] = [];
export const heatmapOdpAreaDistrictOdp: HeatmapLayer[] = [];

export interface PolygonPenetration extends Polygon {
    data?: SummaryPenetration;
}

const DistrictOdpPage = ({ user, device }: OdpAreaProps) => {
    const router = useRouter();
    const mapRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<SheetRef>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const [sourceStore, setSource] = useSource((state) => [state.source, state.setSource]);
    const [statusDistrictOdpSummary] = useDistrictOdpSummaryStore((state) => [state.status]);
    const { setModal } = useModal("modal-filter");

    const initialize = () => {
        googleMapsDistrictOdp = createMap(mapRef.current!, {
            zoomControl: device === "mobile" ? false : true,
        });

        mainMarkerOdpAreaDistrictOdp = new window.google.maps.Marker({
            map: googleMapsDistrictOdp,
            zIndex: 10,
        });

        polygonKelurahanOdpAreaDistrictOdp = new window.google.maps.Polygon({
            map: googleMapsDistrictOdp,
            paths: [],
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
        });

        googleMapsDistrictOdp.addListener("click", (e: MapMouseEvent) => {
            const latLng = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
            fetchKelurahanByLocation(latLng, mapState().source! as SourceDistrictOdp);
            mainMarkerOdpAreaDistrictOdp.setMap(googleMapsDistrictOdp);
        });

        mapsController(googleMapsDistrictOdp);
    };

    return (
        <Wrapper user={user} title="ODP Area" className="overflow-hidden" screenMax>
            <div className="flex flex-col h-full">
                <div className="w-full">
                    <TabBar
                        screenMax
                        parentClassName="w-full gap-0 pl-[135px]"
                        wrapperClassName="w-[150px] flex items-center justify-center bg-white"
                        tab={{
                            value: "district-odp",
                            options: tabOptionsOdpArea,
                            onChange: (value) => {
                                router.push("/planning/odp-area/" + value);
                                setSource(value);
                                clearDataDistrictOdp();
                            },
                        }}
                    />
                    <PageInfo className={tw("w-full text-[13px]", device == "mobile" ? "py-1 px-3 inline-block h-auto" : "py-5")}>
                        Menampilkan data ODP, Building ID dan Heatmap pada kelurahan yang dipilih
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
                                        fetchKelurahanByLocation(latLng, mapState().source! as SourceDistrictOdp);
                                    }}
                                    onFocus={() => {
                                        sheetRef.current!.snapTo(20);
                                    }}
                                />
                                <Button variant="ghost" onClick={() => statusDistrictOdpSummary == "resolve" && setModal(true)}>
                                    <Filter />
                                    Filter
                                </Button>
                            </div>
                        </Then>
                        <Else>
                            <MapsController
                                onResultClick={(latLng) => {
                                    fetchKelurahanByLocation(latLng, mapState().source! as SourceDistrictOdp);
                                }}
                            />
                        </Else>
                    </If>
                    <DistrictOdp device={device} mapState={mapState} sheetRef={sheetRef} />
                </div>
            </div>
            <ModalFilter />
            <ModalDistrictOdp device={device} sheetRef={sheetRef} />
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

export default DistrictOdpPage;

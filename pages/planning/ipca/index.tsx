// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import React, { useEffect, useRef } from "react";
import { Else, If, Then } from "react-if";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import useProfile from "@hooks/useProfile";

import { createMap } from "@functions/maps";

import FilterCard from "@features/planning/ipca/components/FilterCard";
import InfoCard from "@features/planning/ipca/components/InfoCard";
import ModalList from "@features/planning/ipca/components/ModalList";
import { clearDataMaps, clearDataPolygon, fetchKelurahan } from "@features/planning/ipca/queries/odpAddons";
import { useSource } from "@features/planning/ipca/store/filter";

import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";

export let googleMapsIpca: Maps;
export let markerPin: Marker;
export const markerOdps: Marker[] = [];
export const polygonIpca: Polygon[] = [];
export const polygonIpcaBuilding: Polygon[] = [];

const Ipca: React.FC<{ user: User; access: Access; device: Device }> = ({ user, access, device }) => {
    const profile = useProfile();

    const source = useSource((state) => state.source);
    const mapRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<SheetRef>(null);
    const mapState: MapState = () => mapRef.current!.dataset;
    const initialize = () => {
        googleMapsIpca = createMap(mapRef.current!, {
            zoomControl: device === "mobile" ? false : true,
        });

        markerPin = new window.google.maps.Marker({
            map: googleMapsIpca,
            zIndex: 10,
        });

        googleMapsIpca.addListener("click", (e: MapMouseEvent) => {
            clearDataMaps();
            clearDataPolygon();
            fetchKelurahan({ lat: e.latLng!.lat(), lng: e.latLng!.lng() }, device == "mobile" && sheetRef);
        });

        mapsController(googleMapsIpca);
    };

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_validasi_ipca_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    return (
        <Wrapper user={user} title="IPCA (Integrasi Premium Cluster & Apartement)" screenMax>
            <div className="absolute w-full h-full">
                <GoogleMaps
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_IPCA}
                    onInit={initialize}
                    mapRef={mapRef}
                    state={{
                        "data-source": source,
                    }}
                />

                <If condition={device === "mobile"}>
                    <Then>
                        <div className="absolute top-0 flex items-center w-full gap-2 p-2">
                            <MapsController
                                mapType={false}
                                fullscreen={false}
                                access={access}
                                device={device}
                                onResultClick={(latLng) => {
                                    fetchKelurahan(latLng, sheetRef);
                                }}
                            />
                            <FilterCard access={access} mapState={mapState} device={device} sheetRef={sheetRef} />
                        </div>
                    </Then>
                    <Else>
                        <MapsController
                            access={access}
                            device={device}
                            onResultClick={(latLng) => {
                                fetchKelurahan(latLng);
                            }}
                        />
                    </Else>
                </If>
                <InfoCard access={access} mapState={mapState} device={device} sheetRef={sheetRef} />
            </div>
            <ModalList device={device} />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, permissions: ["development"] });

    return server;
});

export default Ipca;

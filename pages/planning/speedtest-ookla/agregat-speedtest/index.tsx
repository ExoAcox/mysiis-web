// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import { Else, If, Then } from "react-if";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import useProfile from "@hooks/useProfile";

import { createMap } from "@functions/maps";

import { FilterCardAgregat } from "@features/planning/speedtest-ookla/components/filter";
import { MainMenuAgregat } from "@features/planning/speedtest-ookla/components/menu";
import { fetchKelurahan } from "@features/planning/speedtest-ookla/queries/agregat";
import { useLocationStore, useSelectedKelurahanStore } from "@features/planning/speedtest-ookla/store/agregat";

import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";

export let googleMaps: Maps;
export let markerMaps: Marker;
export let polygonKelurahan: Polygon;
export const polygonsKota: Polygon[] = [];

const AgregatSpeedtest: React.FC<{ user: User; access: Access; device: Device }> = ({ user, access, device }) => {
    const profile = useProfile();

    const [input, setInput] = useState({});

    const locationStore = useLocationStore();
    const selectedKelurahanStore = useSelectedKelurahanStore();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const sheetRef = useRef<SheetRef>(null);

    const initialize = () => {
        googleMaps = createMap(mapRef.current!, {
            zoomControl: device === "mobile" ? false : true,
        });

        markerMaps = new window.google.maps.Marker({
            map: googleMaps,
            zIndex: 2,
        });

        polygonKelurahan = new window.google.maps.Polygon({
            map: googleMaps,
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
            zIndex: 4,
        });

        googleMaps.addListener("click", (e: MapMouseEvent) => {
            resetData();
            fetchKelurahan(fetchKelurahanArgs({ lat: e.latLng!.lat(), lng: e.latLng!.lng() }));
            setInput({});
        });

        mapsController(googleMaps);
    };

    const fetchKelurahanArgs = (latLng: LatLng) => ({
        latLng,
    });

    const resetData = () => {
        locationStore.reset();
        selectedKelurahanStore.reset();
    };

    useEffect(() => {
        return () => {
            resetData();
        };
    }, []);

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_speedtest_ookla_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    return (
        <Wrapper user={user} screenMax title="Speedtest Ookla" className="flex flex-col" backPath="/">
            <div className="w-full border bg-information-20 border-t-information-40">
                <div className="px-8 py-1">
                    <p className="text-black-100 text-large over">Hasil proses agregasi data speedtest Ookla</p>
                </div>
            </div>
            <div className="relative flex-1">
                <div className="absolute w-full h-full">
                    <GoogleMaps apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_SPEEDTEST_OOKLA} onInit={initialize} mapRef={mapRef} state={{}} />

                    <If condition={device === "mobile"}>
                        <Then>
                            <div className="absolute top-0 flex items-center w-full gap-2 p-2">
                                <MapsController
                                    access={access}
                                    mapType={false}
                                    fullscreen={false}
                                    device={device}
                                    onResultClick={(latLng) => {
                                        googleMaps.panTo(latLng);
                                        if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

                                        resetData();
                                        fetchKelurahan(fetchKelurahanArgs(latLng));
                                    }}
                                    onFocus={() => {
                                        sheetRef.current!.snapTo(20);
                                    }}
                                />
                                <FilterCardAgregat input={input} setInput={setInput} access={access} device={device} />
                            </div>
                        </Then>
                        <Else>
                            <MapsController
                                access={access}
                                fullscreen={false}
                                device={device}
                                onResultClick={(latLng) => {
                                    googleMaps.panTo(latLng);
                                    if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

                                    resetData();
                                    fetchKelurahan(fetchKelurahanArgs(latLng));
                                }}
                            />
                        </Else>
                    </If>
                    <MainMenuAgregat input={input} setInput={setInput} access={access} mapState={mapState} device={device} sheetRef={sheetRef} />
                </div>
            </div>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, permissions: ["development"] });

    return server;
});

export default AgregatSpeedtest;

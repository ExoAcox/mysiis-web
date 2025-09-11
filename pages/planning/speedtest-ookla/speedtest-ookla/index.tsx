import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { Else, If, Then } from "react-if";

import { getServer, session } from "@libs/session";

import { createMap } from "@functions/maps";

import { FilterCardOokla } from "@features/planning/speedtest-ookla/components/filter";
import { MainMenuOokla } from "@features/planning/speedtest-ookla/components/menu";
import { OoklaModal } from "@features/planning/speedtest-ookla/components/modal";
import { fetchKelurahan } from "@features/planning/speedtest-ookla/queries/ookla";
import {
    SpeedtestSource,
    useFilterSpeedtestStore,
    useKelurahanSpeedtestStore,
    useSpeedtestStore,
} from "@features/planning/speedtest-ookla/store/ookla";

import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";

export let googleMaps: Maps;
export let markerMaps: Marker;
export let polygonKelurahan: Polygon;
export let circleSpeedtest: Circle;
export const polygonsSpeedtests: Polygon[] = [];
export const markersSpeedtests: Marker[] = [];

const SpeedtestOklaa: React.FC<{ user: User; access: Access; device: Device }> = ({ user, access, device }) => {
    const filterStore = useFilterSpeedtestStore();
    const kelurahanStore = useKelurahanSpeedtestStore();
    const speedtestStore = useSpeedtestStore();

    const { source, radius, date, nextDate } = filterStore;

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const sheetRef = useRef<SheetRef>(null);

    const initialize = () => {
        googleMaps = createMap(mapRef.current!);

        markerMaps = new window.google.maps.Marker({
            map: googleMaps,
            zIndex: 2,
        });

        circleSpeedtest = new window.google.maps.Circle({
            map: googleMaps,
            strokeColor: "#FF0000",
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: "#FF0000",
            fillOpacity: 0.2,
            clickable: false,
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
        });

        mapsController(googleMaps);
    };

    const fetchKelurahanArgs = (latLng: LatLng) => ({
        latLng,
        radius: Number(mapState().radius),
        source: mapState().source as SpeedtestSource,
        date: mapState().date!,
        nextDate: mapState().nextDate!,
    });

    const resetData = () => {
        kelurahanStore.reset();
        speedtestStore.reset();
    };

    useEffect(() => {
        return () => {
            resetData();
            filterStore.reset();
        };
    }, []);

    return (
        <Wrapper user={user} screenMax title="Speedtest Ookla" className="flex flex-col" backPath="/">
            <div className="w-full border bg-information-20 border-t-information-40">
                <div className="px-8 py-1">
                    <p className="text-black-100 text-large over">Manampilkan data summary yang bersumber dari data Speedtest Ookla</p>
                </div>
            </div>
            <div className="relative flex-1">
                <div className="absolute w-full h-full">
                    <GoogleMaps
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_SPEEDTEST_OOKLA}
                        onInit={initialize}
                        mapRef={mapRef}
                        state={{
                            "data-source": source,
                            "data-radius": radius,
                            "data-date": date,
                            "data-nextdate": nextDate,
                        }}
                    />

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
                                <FilterCardOokla access={access} mapState={mapState} device={device} />
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
                    <MainMenuOokla access={access} mapState={mapState} device={device} sheetRef={sheetRef} />
                </div>
            </div>

            <OoklaModal device={device} />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, permissions: ["development"] });

    return server;
});

export default SpeedtestOklaa;

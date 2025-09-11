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

import { FilterCard, InformationCard, LegendCard } from "@features/planning/data-demand/components/maps/InternetMaps";
import { DetailMapsInternetModal, FilterMapsInternetMobileModal } from "@features/planning/data-demand/components/modal";
import { tabOptions } from "@features/planning/data-demand/functions/common";
import { fetchKelurahan } from "@features/planning/data-demand/queries/internetMaps";
import { useDataInternetStore, useFilterInternetStore } from "@features/planning/data-demand/store/internetMaps";
import { useKelurahanStore } from "@features/planning/data-demand/store/maps";

import { Button } from "@components/button";
import { FloatingMenu, Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { BottomSheet } from "@components/navigation";
import { SheetRef } from "@components/navigation/BottomSheet";

export let googleMaps: Maps;
export let markerPin: Marker;
export const markerDemands: Marker[] = [];

const DataDemand: React.FC<{ user: User; access: Access; device: Device }> = ({ user, access, device }) => {
    const kelurahanStore = useKelurahanStore();
    const dataInternetStore = useDataInternetStore();
    const filterInternetStore = useFilterInternetStore();
    const { predict, cluster } = filterInternetStore;

    const router = useRouter();

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const sheetRef = useRef<SheetRef>(null);
    const [mapType, setMapType] = useState("roadmap");

    const modalFilterMapsInternetMobile = useModal("modal-data-demand-maps-internet-filter-mobile");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    const initialize = () => {
        googleMaps = createMap(mapRef.current!, {
            zoomControl: device === "mobile" ? false : true,
        });

        markerPin = new window.google.maps.Marker({
            map: googleMaps,
            zIndex: 10,
        });

        googleMaps.addListener("click", (e: MapMouseEvent) => {
            resetData();
            fetchKelurahan(
                {
                    latLng: { lat: e.latLng!.lat(), lng: e.latLng!.lng() },
                    predict: JSON.parse(mapState().predict!),
                    cluster: JSON.parse(mapState().cluster!),
                },
                access
            );
        });

        mapsController(googleMaps);
    };

    const resetData = () => {
        kelurahanStore.reset();
        dataInternetStore.reset();
    };

    useEffect(() => {
        return () => {
            resetData();
            filterInternetStore.reset();
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            sheetRef.current?.snapTo("max");
        }, 1000);
    }, [dataInternetStore.status]);

    return (
        <Wrapper
            user={user}
            title="Data Demand"
            screenMax
            tab={{
                value: "internet-summary",
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
                        "data-predict": JSON.stringify(predict),
                        "data-cluster": JSON.stringify(cluster),
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
                            fetchKelurahan(
                                {
                                    latLng,
                                    predict: JSON.parse(mapState().predict!),
                                    cluster: JSON.parse(mapState().cluster!),
                                },
                                access
                            );
                        }}
                        onFocus={() => {
                            sheetRef.current?.snapTo(20);
                        }}
                    />
                    <When condition={isMobile}>
                        <Button
                            onClick={() => modalFilterMapsInternetMobile.setModal(true)}
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
                <When condition={!isMobile}>
                    <div className="absolute bottom-5.5 flex justify-center gap-3 w-full hover:z-[2]">
                        <LegendCard />
                    </div>
                </When>
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
                        <LegendCard />
                    </BottomSheet>
                </When>
            </div>
            <DetailMapsInternetModal />
            <FilterMapsInternetMobileModal access={access} />
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

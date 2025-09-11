// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Else, If, Then } from "react-if";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import { OdpSource } from "@api/odp";

import useProfile from "@hooks/useProfile";

import { createMap } from "@functions/maps";

import {
    ClusterModal,
    FilterCard,
    MainMenu,
    OdpModal,
    PackageModal,
    SmartSalesModal,
    SpeedtestModal,
} from "@features/fulfillment/odp-view/components";
import { fetchKelurahan } from "@features/fulfillment/odp-view/queries";
import {
    OdpFilter,
    useClusterStore,
    useFilterStore,
    useKelurahanStore,
    useOdpStore,
    useSecondOdpStore,
    useSmartSalesStore,
    useSpeedtestStore,
} from "@features/fulfillment/odp-view/store";

import { Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { SheetRef } from "@components/navigation/BottomSheet";

interface Event {
    userId: string;
    name: string;
    lat: number;
    lng: number;
    regional: string;
    witel: string;
    role: string;
    roleId: string;
    platform: "web" | "mobile";
    source: "uim" | "valins" | "underspec";
    status: "success" | "error";
    error?: string;
    mip?: boolean;
}

export let googleMaps: Maps;
export let circleRadius: Circle;
export let markerPin: Marker;
export const markerOdps: Marker[] = [];
export const secondaryMarkerOdps: Marker[] = [];
export let polygonKelurahan: Polygon;
export let polygonBoundary: Polygon;
export let polylineDirection: Polyline;
export const polygonSmartSales: Polygon[] = [];
export const polygonClusters: Polygon[] = [];
export const markerSpeedtests: Marker[] = [];
export let directionsService: DirectionsService
export let directionsRenderer: DirectionsRenderer

const OdpView: React.FC<{ user: User; access: Access; device: Device }> = ({ user, access, device }) => {
    const kelurahanStore = useKelurahanStore();
    const odpStore = useOdpStore();
    const secondOdpStore = useSecondOdpStore();
    const smartSalesStore = useSmartSalesStore();
    const clusterStore = useClusterStore();
    const speedtestStore = useSpeedtestStore();
    const filterStore = useFilterStore();

    const profile = useProfile();

    const { source, radius, filters } = filterStore;

    const router = useRouter();
    const latRouter = router.query?.lat;
    const lngRouter = router.query?.lng;

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const sheetRef = useRef<SheetRef>(null);

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

        polygonKelurahan = new window.google.maps.Polygon({
            map: googleMaps,
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
            zIndex: 4,
        });

        polygonBoundary = new window.google.maps.Polygon({
            map: googleMaps,
            strokeWeight: 3,
            strokeColor: "#388E3C",
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
            zIndex: 5,
        });

        directionsService = new window.google.maps.DirectionsService();
        directionsRenderer = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: true,
        });

        googleMaps.addListener("click", (e: MapMouseEvent) => {
            resetData();
            fetchKelurahan(fetchKelurahanArgs({ lat: e.latLng!.lat(), lng: e.latLng!.lng() }));
        });

        if (latRouter || lngRouter) {
            if (Number(latRouter) && Number(lngRouter)) {
                fetchKelurahan(fetchKelurahanArgs({ lat: Number(latRouter), lng: Number(lngRouter) }));
            } else {
                router.replace("/");
            }
        }

        mapsController(googleMaps);
    };

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_open_odp", {
    //             userId: user.userId,
    //             name: user.fullname,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             roleId: profile.role_details?.roleId ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    // useEffect(() => {
    //     if (analytic && user.userId && ["resolve", "reject"].includes(odpStore.status)) {
    //         const event: Event = {
    //             userId: user.userId,
    //             name: user.fullname,
    //             lat: markerPin?.getPosition()?.lat() ?? 0,
    //             lng: markerPin?.getPosition()?.lng() ?? 0,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             roleId: profile.role_details?.roleId ?? "",
    //             platform: "web",
    //             status: "success",
    //             source,
    //         };

    //         if (odpStore.status === "reject") {
    //             event.status = "error";
    //             event.error = odpStore.error?.message;
    //         }

    //         if (router.query?.mip) {
    //             event.mip = true;
    //         }

    //         if (process.env.NODE_ENV === "production") {
    //             // logEvent(analytic, "hit_odp", event);
    //         }
    //     }
    // }, [odpStore.status, analytic]);

    const fetchKelurahanArgs = (latLng: LatLng) => ({
        latLng,
        access,
        source: mapState().source as OdpSource,
        radius: Number(mapState().radius),
        filters: JSON.parse(mapState().filters!) as OdpFilter[],
    });

    const resetData = () => {
        kelurahanStore.reset();
        odpStore.reset();
        secondOdpStore.reset();
        smartSalesStore.reset();
        clusterStore.reset();
        speedtestStore.reset();
    };

    useEffect(() => {
        return () => {
            resetData();
            filterStore.reset();
        };
    }, []);

    useEffect(() => {
        if (latRouter || lngRouter) {
            if (Number(latRouter) && Number(lngRouter)) {
                setTimeout(() => {
                    sheetRef.current?.snapTo("max");
                }, 1000);
            }
        }
    }, [odpStore.status]);

    useEffect(() => {
        sheetRef.current?.snapTo("max");
    }, [kelurahanStore.status, odpStore.status]);

    return (
        <Wrapper user={user} title="ODP View" screenMax fullscreen={router.query?.mip === "true"}>
            <div className="absolute w-full h-full">
                <GoogleMaps
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_ODP_VIEW}
                    onInit={initialize}
                    mapRef={mapRef}
                    state={{
                        "data-source": source,
                        "data-radius": radius,
                        "data-filters": JSON.stringify(filters),
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
                                    googleMaps.panTo(latLng);
                                    if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

                                    resetData();
                                    fetchKelurahan(fetchKelurahanArgs(latLng));
                                }}
                                onFocus={() => {
                                    sheetRef.current!.snapTo(0);
                                }}
                            />
                            <FilterCard access={access} mapState={mapState} device={device} />
                        </div>
                    </Then>
                    <Else>
                        <MapsController
                            access={access}
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

                <MainMenu access={access} device={device} mapState={mapState} sheetRef={sheetRef} />
            </div>

            <OdpModal device={device} />
            <SmartSalesModal />
            <ClusterModal />
            <SpeedtestModal />
            <PackageModal />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, permissions: ["odp-general"], guest: true });

    return server;
});

export default OdpView;

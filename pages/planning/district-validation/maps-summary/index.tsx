// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import useProfile from "@hooks/useProfile";

import { createMap } from "@functions/maps";

import { RadiusDistrict, TopCard } from "@features/planning/district-validation/components/maps";
import StreetCard from "@features/planning/district-validation/components/maps/StreetCard/indes";
import { districtBarOptions } from "@features/planning/district-validation/functions/common";
import { fetchLocations, fetchNcx, fetchStreet } from "@features/planning/district-validation/queries";
import { useLocationStore, useNcxStore, useRadiusStore, useStreetStore } from "@features/planning/district-validation/store";

import { FloatingMenu, Wrapper } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";

export let googleMaps: Maps;
export let mainMarker: Marker;
export let mainPolygon: Polygon;
export let circleRadiusStreet: Circle;
export const polylineStreets: Polyline[] = [];
export let infoWindowStreet: InfoWindow;

const DistrictValidation: React.FC<{ user: User; access: Access }> = ({ user, access }) => {
    const router = useRouter();
    const profile = useProfile();

    const locationStore = useLocationStore();
    const ncxStore = useNcxStore();
    const streetStore = useStreetStore();
    const radiusStore = useRadiusStore();

    const { radius } = radiusStore;

    const mapRef = useRef<HTMLDivElement>(null);
    const mapState: MapState = () => mapRef.current!.dataset;

    const initialize = () => {
        googleMaps = createMap(mapRef.current!);

        mainMarker = new window.google.maps.Marker({
            map: googleMaps,
            zIndex: 2,
        });

        circleRadiusStreet = new window.google.maps.Circle({
            map: googleMaps,
            strokeColor: "#FF0000",
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: "#FF0000",
            fillOpacity: 0.2,
            clickable: false,
            zIndex: 2,
        });

        mainPolygon = new window.google.maps.Polygon({
            map: googleMaps,
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
            zIndex: 4,
        });

        infoWindowStreet = new window.google.maps.InfoWindow({
            content: "",
        });

        googleMaps.addListener("click", (e: MapMouseEvent) => {
            resetData();

            fetchLocations(getLocationsAgrs({ lat: e.latLng!.lat(), lng: e.latLng!.lng() }));
            fetchNcx(getNcxAgrs({ lat: e.latLng!.lat(), lng: e.latLng!.lng() }));
            fetchStreet(getStreetAgrs({ lat: e.latLng!.lat(), lng: e.latLng!.lng() }));
        });

        mapsController(googleMaps);

        if (router.query.lat && router.query.lng) {
            resetData();

            fetchLocations(getLocationsAgrs({ lat: Number(router.query.lat), lng: Number(router.query.lng) }));
            fetchNcx(getNcxAgrs({ lat: Number(router.query.lat), lng: Number(router.query.lng) }));
            fetchStreet(getStreetAgrs({ lat: Number(router.query.lat), lng: Number(router.query.lng) }));
        }
    };

    const getLocationsAgrs = (latLng: LatLng) => ({
        latLng,
        radius: Number(mapState().radius),
    });

    const getNcxAgrs = (latLng: LatLng) => ({
        latLng,
    });

    const getStreetAgrs = (latLng: LatLng) => ({
        latLng,
        radius: Number(mapState().radius),
    });

    const resetData = () => {
        locationStore.reset();
        ncxStore.reset();
        streetStore.reset();
    };

    useEffect(() => {
        return () => {
            resetData();
            radiusStore.reset();
        };
    }, []);

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_district_validation_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    return (
        <Wrapper
            user={user}
            screenMax
            title="District Validation"
            tab={{
                value: "maps-summary",
                options: districtBarOptions,
                onChange: (value) => {
                    router.push(`/planning/district-validation/${value}`);
                },
            }}
            backPath="/"
        >
            <div className="absolute w-full h-full overflow-hidden">
                <GoogleMaps
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_DISTRICT_VALIDATION}
                    onInit={initialize}
                    mapRef={mapRef}
                    state={{ "data-radius": radius }}
                />
                <MapsController
                    access={access}
                    onResultClick={(latLng) => {
                        googleMaps.panTo(latLng);
                        if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

                        resetData();
                        fetchLocations(getLocationsAgrs(latLng));
                        fetchNcx(getNcxAgrs(latLng));
                        fetchStreet(getStreetAgrs(latLng));
                    }}
                />
                <FloatingMenu className="flex flex-col gap-4 w-[20.875rem] overflow-hidden">
                    <RadiusDistrict />
                    <div className="flex flex-col gap-4 overflow-auto scrollbar-hidden">
                        <StreetCard access={access} />
                        <TopCard access={access} />
                    </div>
                </FloatingMenu>
            </div>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = getServer({
        context,
        permissions: ["mysiis.district-validation"],
    });

    return server;
});

export default DistrictValidation;

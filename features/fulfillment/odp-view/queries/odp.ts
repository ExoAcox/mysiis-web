import { getDirection } from "@api/district/direction";
import { Odp, OdpBoundary, OdpSource, StatusOcc, getOdp } from "@api/odp";

import { useModalOutside } from "@hooks/useModal";

import { errorHelper } from "@functions/common";
import { setMapNull } from "@functions/maps";
import { formatOdpToGeneral, getRandomOdp, odpIconSvg } from "@functions/odp";

import {
    circleRadius,
    directionsRenderer,
    directionsService,
    googleMaps,
    markerOdps,
    markerPin,
    polygonBoundary,
    polylineDirection,
    secondaryMarkerOdps,
} from "@pages/fulfillment/odp-view";

import { getOdpPercent, infoWindowContent } from "../functions/odp";
import { OdpFilter, odpDefaultValue, useFilterStore, useOdpStore, useSecondOdpStore } from "../store";

export interface FetchOdp {
    access: Access;
    source: OdpSource;
    radius: number;
    latLng: LatLng;
    filters: OdpFilter[];
}

const fetchOdp = async (args: FetchOdp) => {
    const { access, source, radius, latLng, filters } = args;

    setMapNull(markerOdps);
    setMapNull(secondaryMarkerOdps);
    polylineDirection.setPath([]);

    return fetchDummyOdp(latLng, radius);

    if (access === "unauthorized" || access === "forbidden") {
        return fetchDummyOdp(latLng, radius);
    }
    // else if (access === "forbidden") {
    //     return useOdpStore.setState({ data: odpDefaultValue, status: "reject", error: { code: 471 } });
    // }

    useOdpStore.setState({ data: odpDefaultValue, status: "pending", error: null });
    useSecondOdpStore.setState({ data: odpDefaultValue, status: "pending", error: null });

    const isBoundaryActive = filters.includes("boundary");
    useFilterStore.setState({ filters: isBoundaryActive ? ["boundary"] : [] });

    try {
        const data = await getOdp({ source, radius, lat: latLng.lat, long: latLng.lng, isBoundaryActive });
        const rawOdps = isBoundaryActive ? (data as OdpBoundary).odp : data;
        const odps = formatOdpToGeneral(rawOdps as Odp[], source);

        if (isBoundaryActive) {
            const normal = (data as OdpBoundary).polygon.slice(0, 7) == "POLYGON";
            const paths = (data as OdpBoundary).polygon
                .slice(normal ? 9 : 17, normal ? -2 : -3)
                .split(",")
                .map((row) => {
                    const split = row.split(" ");
                    return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                });

            polygonBoundary.setPath(paths);
            circleRadius.setRadius(0);
        }

        odps.forEach((odp) => {
            const marker: Marker = new window.google.maps.Marker({
                map: googleMaps,
                position: { lat: odp.lat, lng: odp.lng },
                icon: odpIconSvg(odp.status),
                zIndex: 3,
            });

            marker.set("name", odp.name);
            marker.set("status", odp.status);
            marker.set("idlePort", odp.idlePort);
            marker.set("devicePort", odp.devicePort);

            marker.set(
                "infoWindow",
                new window.google.maps.InfoWindow({
                    content: infoWindowContent(odp),
                })
            );

            // marker.addListener("mouseover", () => {
            //     markerOdps.forEach((marker) => marker.get("infoWindow").close());
            //     marker.get("infoWindow").open(googleMaps, marker);

            //     const copyLocation = () => {
            //         navigator.clipboard.writeText(`${odp.lat}, ${odp.lng}`);
            //     };

            //     const showPackage = () => {
            //         const data = {
            //             deviceId: odp.deviceId,
            //             networkLocationCode: odp.networkLocationCode,
            //             stoCode: odp.stoCode,
            //         };

            //         useModalOutside("odp-view/package", { visible: true, data });
            //     };

            //     setTimeout(() => {
            //         const elementPackage = document.getElementById("infowindow-show-package");
            //         elementPackage?.removeEventListener("click", showPackage);
            //         elementPackage?.addEventListener("click", showPackage);

            //         const elementCopy = document.getElementById("infowindow-copy-location");
            //         elementCopy?.removeEventListener("click", copyLocation);
            //         elementCopy?.addEventListener("click", copyLocation);
            //     }, 100);
            // });

            marker.addListener("click", async () => {
                markerOdps.forEach((marker) => marker.get("infoWindow").close());
                marker.get("infoWindow").open(googleMaps, marker);
                polylineDirection.setPath([]);

                const copyLocation = () => {
                    navigator.clipboard.writeText(`${odp.lat}, ${odp.lng}`);
                };

                const showPackage = () => {
                    const data = {
                        deviceId: odp.deviceId,
                        networkLocationCode: odp.networkLocationCode,
                        stoCode: odp.stoCode,
                    };

                    useModalOutside("odp-view/package", { visible: true, data });
                };

                setTimeout(() => {
                    const elementPackage = document.getElementById("infowindow-show-package");
                    elementPackage?.removeEventListener("click", showPackage);
                    elementPackage?.addEventListener("click", showPackage);

                    const elementCopy = document.getElementById("infowindow-copy-location");
                    elementCopy?.removeEventListener("click", copyLocation);
                    elementCopy?.addEventListener("click", copyLocation);
                }, 500);

                const startLatLng = markerPin.getPosition()!;

                try {
                    const direction = await getDirection({
                        start_lat: startLatLng.lat(),
                        start_long: startLatLng.lng(),
                        end_lat: odp.lat,
                        end_long: odp.lng,
                    });

                    const path = direction.geometry.coordinates.map((coords) => ({ lat: coords[1], lng: coords[0] }));
                    const distance = direction.properties.summary.distance;
                    polylineDirection.setPath(path);

                    const infoWindow = marker.get("infoWindow");
                    infoWindow.setContent(infoWindowContent(odp, distance));
                    infoWindow.open(googleMaps, marker);
                } catch { }
            });

            markerOdps.push(marker);
        });

        useOdpStore.setState({ data: { value: odps.length, percent: getOdpPercent(markerOdps) }, status: "resolve" });

        if (["uim", "valins"].includes(source)) {
            fetchSecondOdp({ source, radius, latLng, isBoundaryActive });
        }
    } catch (error) {
        useOdpStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export interface FetchSecondOdp {
    source: OdpSource;
    radius: number;
    latLng: LatLng;
    isBoundaryActive: boolean;
}

const fetchSecondOdp = async ({ source, radius, latLng, isBoundaryActive }: FetchSecondOdp) => {
    const flipSource = source === "uim" ? "valins" : "uim";

    useSecondOdpStore.setState({ data: odpDefaultValue, status: "pending", error: null });

    try {
        const data = await getOdp({ source: flipSource, radius, lat: latLng.lat, long: latLng.lng, isBoundaryActive });
        const rawOdps = isBoundaryActive ? (data as OdpBoundary).odp : data;
        const odps = formatOdpToGeneral(rawOdps as Odp[], source);

        odps.forEach((odp) => {
            const marker = new window.google.maps.Marker();
            marker.set("lat", odp.lat);
            marker.set("lng", odp.lng);
            marker.set("status", odp.status);
            marker.set("idlePort", odp.idlePort);
            marker.set("devicePort", odp.devicePort);

            secondaryMarkerOdps.push(marker);
        });

        useSecondOdpStore.setState({ data: { value: odps.length, percent: getOdpPercent(secondaryMarkerOdps) }, status: "resolve" });
    } catch (error) {
        useSecondOdpStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

const fetchDummyOdp = (latLng: LatLng, radius: number) => {
    const dummyOdps = Array.from({ length: 30 }).map(() => {
        const odp = getRandomOdp({ latLng, radius });

        const marker: Marker = new window.google.maps.Marker({
            map: googleMaps,
            position: { lat: odp.lat, lng: odp.lng },
            icon: odpIconSvg(odp.status as StatusOcc),
            zIndex: 3,
        });

        marker.set("name", odp.name);
        marker.set("status", odp.status);
        marker.set("idlePort", odp.idlePort);
        marker.set("devicePort", odp.devicePort);
        marker.set(
            "infoWindow",
            new window.google.maps.InfoWindow({
                content: infoWindowContent(odp),
            })
        );

        // marker.addListener("mouseover", () => {
        //     markerOdps.forEach((marker) => marker.get("infoWindow").close());
        //     marker.get("infoWindow").open(googleMaps, marker);
        // });

        // marker.addListener("mouseout", () => {
        //     markerOdps.forEach((marker) => marker.get("infoWindow").close());
        // });

        marker.addListener("click", async () => {
            markerOdps.forEach((marker) => marker.get("infoWindow").close());
            marker.get("infoWindow").open(googleMaps, marker);
            directionsRenderer.setMap(null);

            const copyLocation = () => {
                navigator.clipboard.writeText(`${odp.lat}, ${odp.lng}`);
            };

            // const showPackage = () => {
            //     const data = {
            //         deviceId: odp.deviceId,
            //         networkLocationCode: odp.networkLocationCode,
            //         stoCode: odp.stoCode,
            //     };

            //     useModalOutside("odp-view/package", { visible: true, data });
            // };

            setTimeout(() => {
                // const elementPackage = document.getElementById("infowindow-show-package");
                // elementPackage?.removeEventListener("click", showPackage);
                // elementPackage?.addEventListener("click", showPackage);

                const elementCopy = document.getElementById("infowindow-copy-location");
                elementCopy?.removeEventListener("click", copyLocation);
                elementCopy?.addEventListener("click", copyLocation);
            }, 500);

            const startLatLng = markerPin.getPosition()!;

            try {
                // const direction = await getDirection({
                //     start_lat: startLatLng.lat(),
                //     start_long: startLatLng.lng(),
                //     end_lat: odp.lat,
                //     end_long: odp.lng,
                // });

                // const path = direction.geometry.coordinates.map((coords) => ({ lat: coords[1], lng: coords[0] }));
                // const distance = direction.properties.summary.distance;
                // polylineDirection.setPath(path);

                directionsService.route(
                    {
                        origin: `${startLatLng.lat()},${startLatLng.lng()}`,
                        destination: `${odp.lat},${odp.lng}`,
                        travelMode: "WALKING" as any,
                    },
                    (response, status) => {
                        if (status === "OK") {
                            directionsRenderer.setMap(googleMaps);
                            directionsRenderer.setDirections(response);

                            if (response?.routes?.[0]?.legs?.[0]?.distance?.value) {
                                const infoWindow = marker.get("infoWindow");
                                infoWindow.setContent(infoWindowContent(odp, response?.routes?.[0]?.legs?.[0]?.distance?.value));
                                infoWindow.open(googleMaps, marker);
                            }
                        }


                    },
                );


            } catch { }
        });

        markerOdps.push(marker);
    });

    useOdpStore.setState({ data: { value: dummyOdps.length, percent: getOdpPercent(markerOdps) }, status: "resolve" });
};

export default fetchOdp;

import { getDirection } from "@api/district/direction";
import { Odp, OdpBoundary, StatusOcc, getOdp } from "@api/odp";

import { errorHelper } from "@functions/common";
import { setMapNull } from "@functions/maps";
import { formatOdpToGeneral, getRandomOdp, odpIconSvg } from "@functions/odp";

import { circleRadius, googleMaps, markerOdps, markerPin, polygonBoundary, polylineDirection } from "@pages/planning/data-demand/maps-summary";

import { getOdpPercent, infoWindowContent } from "@features/fulfillment/odp-view/functions/odp";
import { FetchOdp as FetchOdpView, FetchSecondOdp as FetchSecondOdpView } from "@features/fulfillment/odp-view/queries/odp";
import { odpDefaultValue as odpViewDefaultValue } from "@features/fulfillment/odp-view/store";

import { useOdpViewStore, useSecondOdpViewStore } from "../../store/maps";

const fetchOdpView = async (args: FetchOdpView) => {
    const { access, source, radius, latLng, filters } = args;

    setMapNull(markerOdps);
    polylineDirection?.setPath([]);

    if (access !== "allowed") {
        return fetchDummyOdp(latLng, radius);
    }

    useOdpViewStore.setState({ data: odpViewDefaultValue, status: "pending", error: null });
    useSecondOdpViewStore.setState({ data: odpViewDefaultValue, status: "pending", error: null });

    const isBoundaryActive = filters.includes("boundary");

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

            marker.addListener("mouseover", () => {
                markerOdps.forEach((marker) => marker.get("infoWindow").close());
                marker.get("infoWindow").open(googleMaps, marker);
            });

            marker.addListener("mouseout", () => {
                markerOdps.forEach((marker) => marker.get("infoWindow").close());
            });

            marker.addListener("click", async () => {
                markerOdps.forEach((marker) => marker.get("infoWindow").close());

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
                    polylineDirection?.setPath(path);

                    const infoWindow = marker.get("infoWindow");
                    infoWindow.setContent(infoWindowContent(odp, distance));
                    infoWindow.open(googleMaps, marker);
                } catch {}
            });

            markerOdps.push(marker);
        });

        useOdpViewStore.setState({ data: { value: odps.length, percent: getOdpPercent(markerOdps) }, status: "resolve" });

        if (["uim", "valins"].includes(source)) {
            fetchSecondOdp({ source, radius, latLng, isBoundaryActive });
        }
    } catch (error) {
        useOdpViewStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

const fetchSecondOdp = async ({ source, radius, latLng }: FetchSecondOdpView) => {
    const flipSource = source === "uim" ? "valins" : "uim";

    useSecondOdpViewStore.setState({ data: odpViewDefaultValue, status: "pending", error: null });

    try {
        const data = await getOdp({ source: flipSource, radius, lat: latLng.lat, long: latLng.lng });
        const odps = formatOdpToGeneral(data as Odp[], source);

        const markers = odps.map((odp) => {
            const marker = new window.google.maps.Marker();
            marker.set("idlePort", odp.idlePort);
            marker.set("devicePort", odp.devicePort);
            return marker;
        });

        useSecondOdpViewStore.setState({ data: { value: markers.length, percent: getOdpPercent(markers) }, status: "resolve" });
    } catch (error) {
        useSecondOdpViewStore.setState({ status: "reject", error: errorHelper(error) });
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
                content: "Ini data dummy",
            })
        );

        marker.addListener("mouseover", () => {
            markerOdps.forEach((marker) => marker.get("infoWindow").close());
            marker.get("infoWindow").open(googleMaps, marker);
        });

        marker.addListener("mouseout", () => {
            markerOdps.forEach((marker) => marker.get("infoWindow").close());
        });

        markerOdps.push(marker);
    });

    useOdpViewStore.setState({ data: { value: dummyOdps.length, percent: getOdpPercent(markerOdps) }, status: "resolve" });
};

export default fetchOdpView;

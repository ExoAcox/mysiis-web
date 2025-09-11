import MarkerClusterer from "@googlemaps/markerclustererplus";
import { useEffect, useRef, useState } from "react";
import { When } from "react-if";

import { Respondent } from "@api/survey-demand/respondent";

import useMediaQuery from "@hooks/useMediaQuery";

import { createMap, setMapNull } from "@functions/maps";

import Info from "@images/vector/info.svg";

import { onMouseOverCluster } from "@features/planning/data-demand/components/maps/MapsPreview/functions";

import { Button } from "@components/button";
import { FloatingMenu } from "@components/layout";
import { GoogleMaps, MapsController } from "@components/maps";
import { mapsController } from "@components/maps/MapsController";
import { Link } from "@components/navigation";

interface Props {
    listAllData: Respondent[];
}

export let googleMapsInstance: Maps;
export let infoWindowDemand: InfoWindow;
export const markerDemands: Marker[] = [];
export let clusterDemands: MarkerClusterer;

const PreviewContent = ({ listAllData }: Props) => {
    const { isMobile } = useMediaQuery(359, { debounce: false });

    const [googleMaps, setGoogleMaps] = useState<Maps | null>(null);
    const [listAllDataTemp, setListAllDataTemp] = useState<Respondent[]>([]);
    const mapRef = useRef<HTMLDivElement>(null);

    const initialize = () => {
        googleMapsInstance = createMap(mapRef.current!, { gestureHandling: "cooperative", zoomControl: false });
        setGoogleMaps(googleMapsInstance);

        infoWindowDemand = new window.google.maps.InfoWindow({ pixelOffset: new window.google.maps.Size(0, -20) });

        clusterDemands = new MarkerClusterer(googleMapsInstance, [], {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            minimumClusterSize: 1,
        });

        googleMapsInstance.addListener("zoom_changed", () => {
            infoWindowDemand.close();
        });

        window.google.maps.event.addListener(clusterDemands, "mouseover", onMouseOverCluster);

        mapsController(googleMapsInstance);
    };

    const fetchListData = () => {
        const respondents = listAllData || listAllDataTemp;

        setMapNull(markerDemands);
        clusterDemands?.clearMarkers();

        if (respondents.length) {
            const bounds = new window.google.maps.LatLngBounds();

            const markers = respondents.map((respondent) => {
                const marker: Marker = new window.google.maps.Marker({
                    map: googleMaps,
                    position: { lat: Number(respondent.latitude), lng: Number(respondent.longitude) },
                    opacity: 0,
                });

                marker.set("scale", respondent.conf_scale_of_needid);

                const content = `<div class="p-1 font-bold">
                    <div class="flex gap-2">
                        <span class="w-16">Nama</span>
                        <span>:</span>
                        <span>${respondent.name}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="w-16">Langganan</span>
                        <span>:</span>
                        <span>${respondent.conf_scale_of_need_value || "-"}</span>
                    </div>
                    <div class="flex gap-2">
                        <span class="w-16">Skala</span>
                        <span>:</span>
                        <span>${respondent.conf_subscribe_plans_value || "-"}</span>
                    </div>
                </div>`;

                marker.set(
                    "infoWindow",
                    new window.google.maps.InfoWindow({
                        content: content,
                    })
                );

                marker.addListener("mouseover", () => {
                    markerDemands.forEach((marker) => marker.get("infoWindow").close());
                    marker.get("infoWindow").open(googleMaps, marker);
                });

                const mouseout = marker.addListener("mouseout", () => {
                    markerDemands.forEach((marker) => marker.get("infoWindow").close());
                });

                marker.addListener("click", () => {
                    markerDemands.forEach((marker) => marker.get("infoWindow").close());
                    marker.get("infoWindow").open(googleMaps, marker);
                    window.google.maps.event.removeListener(mouseout);
                });

                markerDemands.push(marker);
                bounds.extend(new window.google.maps.LatLng(Number(respondent.latitude), Number(respondent.longitude)));

                return marker;
            });

            clusterDemands?.addMarkers(markers);
            googleMaps!.fitBounds(bounds);
        } else {
            googleMaps!.setZoom(5);
            googleMaps!.setCenter({
                lat: -0.7893,
                lng: 113.9213,
            });
        }
    };

    useEffect(() => {
        if (googleMaps) {
            fetchListData();
        } else {
            setListAllDataTemp(listAllData);
        }
    }, [listAllData, googleMaps]);

    return (
        <div className="absolute inset-0">
            <GoogleMaps apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_DATA_DEMAND} mapRef={mapRef} onInit={initialize} />
            <MapsController searchBox={false} mapType={false} fullscreen={isMobile ? false : true} />
            <FloatingMenu className="flex flex-col items-start justify-between p-0 w-fit">
                <Link href="/planning/data-demand/maps-summary" className="p-3 pr-0 w-fit">
                    <Button variant="ghost" className="w-fit" labelClassName="gap-2">
                        <Info />
                        Lihat Info Detail
                    </Button>
                </Link>
                <When condition={listAllData.length}>
                    <div className="w-full p-1 text-sm font-semibold text-white bg-black-90 rounded-tr-md">{`${listAllData.length} Responden ditemukan`}</div>
                </When>
            </FloatingMenu>
        </div>
    );
};

export default PreviewContent;

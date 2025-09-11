import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Else, If, Then, When } from "react-if";

import { Respondent, getRespondentByRegAndPolygon } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";

import { createMap } from "@functions/maps";

import { generateInfoWindow } from "@features/planning/dashboard-microdemand/functions/dashboard";
import { useFilterStore } from "@features/planning/dashboard-microdemand/store/dashboard";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Spinner } from "@components/loader";
import { GoogleMaps } from "@components/maps";
import { ModalTitle } from "@components/text";

let googleMaps: Maps;
const markersSurvey: Marker[] = [];
let polygonSurvey: Polygon;

const ModalSurveyResult = () => {
    const [lists, setLists] = useState<Respondent[]>([]);
    const { modal, data, setModal } = useModal<Respondent>("dashboard-survey-maps");
    const mapRef = useRef<HTMLDivElement>(null);

    const filterStore = useFilterStore();
    const { startDate, endDate, category } = filterStore;

    const respondent = useMutation({
        mutationKey: ["/dashboard-microdemand/maps-respondent", data.mysista_data?.objectid],
        mutationFn: (id: number) =>
            getRespondentByRegAndPolygon({
                page: 1,
                row: 1000,
                survey_at_start: startDate,
                survey_at_end: endDate,
                mysistaid: id,
                surveyid: category,
            }),
    });

    const handleCloseModal = () => {
        setModal(false);
    };

    const initialize = () => {
        const mysiistaData = data.mysista_data;
        if (!mysiistaData) return;
        if (!mysiistaData.wkt) return;

        googleMaps = createMap(mapRef.current!, {
            zoom: 17,
            center: { lat: parseFloat(mysiistaData.lat), lng: parseFloat(mysiistaData.lon) },
            mapTypeControl: true,
        });

        const bounds = new window.google.maps.LatLngBounds();
        const normal = mysiistaData.wkt.slice(0, 7) == "POLYGON";
        const path = mysiistaData.wkt
            .slice(normal ? 11 : 17, normal ? -2 : -3)
            .split(", ")
            .map((row) => {
                const split = row.split(" ");
                const latLng = { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                bounds.extend(latLng);
                return latLng;
            });

        googleMaps.fitBounds(bounds);
        polygonSurvey = new window.google.maps.Polygon({
            map: googleMaps,
            paths: path,
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
            zIndex: 4,
        });

        polygonSurvey.getMap();

        const marker = new window.google.maps.Marker({
            map: googleMaps,
            position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
            zIndex: 2,
        });

        markersSurvey.push(marker);
        generateInfoWindow({ data, marker, markers: markersSurvey, googleMaps });

        const getUrlIcon = (priority?: string) => {
            switch (priority) {
                case "high":
                    return "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
                case "medium":
                    return "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
                case "low":
                    return "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
                default:
                    return "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
            }
        }

        respondent.mutate(mysiistaData.objectid, {
            onSuccess: (data) => {
                setLists(data.lists);

                data.lists.forEach((dataRespondent) => {
                    const marker = new window.google.maps.Marker({
                        map: googleMaps,
                        position: { lat: parseFloat(dataRespondent.latitude), lng: parseFloat(dataRespondent.longitude) },
                        zIndex: 3,
                        icon: {
                            url: getUrlIcon(dataRespondent.priority),
                        },
                    });

                    markersSurvey.push(marker);
                    generateInfoWindow({ data: dataRespondent, marker, markers: markersSurvey, googleMaps });
                });
            },
        });
    };

    const handleDownloadKML = () => {
        const statuses = ["valid", "valid-mitra", "invalid", "unvalidated"]; // Example statuses
        const colors: { [key: string]: string } = {
            valid: "ff009e60",
            "valid-mitra": "fff1c232",
            invalid: "ffcc0000",
            unvalidated: "ff999999",
        }; // ARGB colors

        // download kml file with polygon and markers with different colors based on status of the markers (valid, invalid, etc) and grouping point per folder based on status

        const kml = `<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
            <Document>
                <name>${data.mysista_data?.name}</name>
                <Style id="polyStyle">
                    <LineStyle>
                        <color>ff0000ff</color>
                        <width>2</width>
                    </LineStyle>
                    <PolyStyle>
                        <fill>0</fill>
                        <outline>1</outline>
                    </PolyStyle>
                </Style>
                ${statuses
                    .map(
                        (status) => `
                    <Style id="${status}">
                        <IconStyle>
                            <color>${colors[status]}</color>
                        </IconStyle>
                    </Style>
                `
                    )
                    .join("")}
                <Placemark>
                    <name>${data.mysista_data?.name}</name>
                    <styleUrl>#polyStyle</styleUrl>
                    <Polygon>
                        <outerBoundaryIs>
                            <LinearRing>
                                <coordinates>${polygonSurvey
                                    .getPath()
                                    .getArray()
                                    .map((latLng) => latLng.lng() + "," + latLng.lat())
                                    .join(" ")}</coordinates>
                            </LinearRing>
                        </outerBoundaryIs>
                    </Polygon>
                </Placemark>
                ${statuses
                    .map(
                        (status) => `
                    <Folder>
                        <name>${status}</name>
                        ${lists
                            .filter((list) => list.status === status)
                            .map(
                                (list) => `
                            <Placemark>
                                <name>${list.id}</name>
                                <styleUrl>#${list.status}</styleUrl>
                                <Point>
                                    <coordinates>${list.longitude},${list.latitude}</coordinates>
                                </Point>
                            </Placemark>
                        `
                            )
                            .join("")}
                    </Folder>
                `
                    )
                    .join("")}
            </Document>
        </kml>`;

        const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.mysista_data?.name + ".kml"; // Adjust the download name as needed
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Modal visible={modal}>
            <ModalTitle onClose={handleCloseModal}>Lihat Maps ({data.id})</ModalTitle>

            <div className="inline-flex items-center justify-end w-full mt-2">
                <Button onClick={handleDownloadKML} className="mr-2">
                    Download KML
                </Button>
            </div>
            <div className="relative w-[700px] h-[400px] mt-2">
                <When condition={data.id}>
                    <If condition={!!data.mysista_data?.wkt}>
                        <Then>
                            <GoogleMaps
                                apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_DASHBOARD_MICRODEMAND}
                                mapRef={mapRef}
                                onInit={initialize}
                                className="rounded-md"
                            />
                        </Then>
                        <Else>
                            <div className="flex items-center justify-center w-full h-full">Tidak ditemukan data!</div>
                        </Else>
                    </If>
                    <When condition={respondent.isPending}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Spinner size={100} />
                        </div>
                    </When>
                </When>
            </div>
        </Modal>
    );
};

export default ModalSurveyResult;

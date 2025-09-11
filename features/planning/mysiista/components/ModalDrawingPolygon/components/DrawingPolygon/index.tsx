import { useEffect, useRef } from "react";
import { Else, If, Then, When } from "react-if";

import useModal from "@hooks/useModal";
import useProfile from "@hooks/useProfile";

import { createDrawingManager, createMap } from "@functions/maps";
import { tw } from "@functions/style";

import { menuTemplate } from "@features/planning/mysiista/function";
import { getDataBuilding, getDataListSurveyor, handleDrawer } from "@features/planning/mysiista/function/drawing";
import { eventListenerDrawingPolygon } from "@features/planning/mysiista/function/event";
import { getDatabatasKelurahan } from "@features/planning/mysiista/queries/drawing";
import { usePriority } from "@features/planning/mysiista/store/drawing";

import { GoogleMaps } from "@components/maps";
import { Subtitle } from "@components/text";

import Dropdown from "../../Mobile/Dropdown";
import DrawingTab from "../DrawingTab";
import MenuMaps from "../MenuMaps";
import MenuTemplate from "../MenuTemplate";

export let googleMapsDrawingMysiista: Maps;
export let drawingManager: google.maps.drawing.DrawingManager;
export let polygonDrawing: Polygon;
export let polygonsDrawing: number[][][];

export default function DrawingPolygon({ device }: { device: Device }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const priority = usePriority((state) => state.priority);
    const { modal, data } = useModal("moda-drawing-polygon");
    const profile = useProfile();

    const initialize = () => {
        googleMapsDrawingMysiista = createMap(mapRef.current!, {
            zoomControl: false,
        });
        if (data) {
            googleMapsDrawingMysiista.setCenter(data as LatLng);
            googleMapsDrawingMysiista.setZoom(16);
        }
        if (mapRef && modal) {
            const drawing = createDrawingManager({
                color: menuTemplate.find((e) => e.value == priority)?.color || "red",
                googleMaps: googleMapsDrawingMysiista,
            });
            drawingManager = drawing;
        }
        eventListenerDrawingPolygon({ googleMaps: googleMapsDrawingMysiista });
    };

    useEffect(() => {
        setTimeout(() => {
            if (drawingManager) {
                drawingManager.addListener("overlaycomplete", (e: { overlay: Polygon }) => {
                    const overlay = e.overlay;
                    polygonDrawing = overlay;
                    drawingManager.setDrawingMode(null);
                    const list: number[][] = overlay
                        .getPath()
                        .getArray()
                        ?.map((data) => [data.lng(), data.lat()]);
                    polygonsDrawing = [[...list, list[0]]];
                    getDataBuilding();
                    getDatabatasKelurahan(profile);
                });
            }
        }, 500);
    }, [drawingManager, data, mapRef]);

    useEffect(() => {
        getDataListSurveyor();
    }, []);

    return (
        <div className={tw(device == "mobile" ? "relative w-full h-[75%]" : "w-[65%] h-[75%] relative")}>
            <Subtitle className="mt-5">Pilih Template Prioritas</Subtitle>
            <If condition={device == "mobile"}>
                <Then>
                    <Dropdown />
                </Then>
                <Else>
                    <MenuTemplate />
                </Else>
            </If>
            <div className="absolute w-full h-full mt-5 overflow-hidden rounded-lg">
                <GoogleMaps apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_MYSIISTA} onInit={initialize} mapRef={mapRef} />
                <MenuMaps device={device} />
                <When condition={device == "mobile"}>
                    <div className="absolute flex flex-col items-center w-full bottom-3">
                        <DrawingTab onChange={handleDrawer} />
                    </div>
                </When>
            </div>
        </div>
    );
}

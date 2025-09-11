import { toast } from "react-toastify";
import { convertToWK } from "wkt-parser-helper";

import { getPredicCountBulding } from "@api/survey-demand/mysiista";
import { getVendor } from "@api/survey-demand/utility";

import { errorHelper } from "@functions/common";

import { useStreetStore } from "@features/planning/district-validation/store";

import { menuTemplate, optionDrawing } from "..";
import { drawingManager, polygonDrawing, polygonsDrawing } from "../../components/ModalDrawingPolygon/components/DrawingPolygon";
import { StateDrawingTab } from "../../components/ModalDrawingPolygon/components/DrawingTab";
import { resetData } from "../../queries/odp";
import { dataListBody, useBodyStore, useListSurveyor, usePredicBuildingStore, usePriority } from "../../store/drawing";
import { useOdpPercentStore, useSourceastore } from "../../store/odp";

export const handleDelete = () => {
    polygonDrawing?.setMap(null);
    drawingManager && drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    useBodyStore.getState().reset();
};

export const handleReset = () => {
    polygonDrawing?.setMap(null);
    useBodyStore.getState().reset();
    usePriority.getState().reset();
    useSourceastore.getState().reset();
    useStreetStore.getState().reset();
    useOdpPercentStore.getState().reset();
    useListSurveyor.getState().reset();
    resetData();
};

export const handleDrawPolygon = () => {
    drawingManager && drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    handleDelete();
};

export const handleDrawer = (type: StateDrawingTab | "delete") => {
    if (drawingManager) {
        switch (type) {
            case "hand":
                drawingManager.setDrawingMode(null);
                break;
            case "polygon":
                handleDrawPolygon();
                break;
            case "delete":
                handleDelete();
                break;
            default:
                break;
        }
    }
};

export const handlePriority = (value: string, priority: number) => {
    usePriority.setState({ priority: value });
    useBodyStore.getState().set({ ...dataListBody, prioritas: String(priority) });
    const color = menuTemplate.find((e) => e.value == value)?.color;
    handleDrawPolygon();
    drawingManager &&
        drawingManager.setOptions({
            polygonOptions: {
                ...optionDrawing,
                fillColor: color,
                strokeColor: color,
            },
        });
};

export const getDataBuilding = () => {
    const myFeature = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Polygon",
            coordinates: polygonsDrawing,
        },
    };
    const myFeatureAsWKT = convertToWK(myFeature);
    const body = { polygon: myFeatureAsWKT };
    usePredicBuildingStore.setState({ status: "pending" });
    getPredicCountBulding(body)
        .then((building) => {
            usePredicBuildingStore.setState({ building: building[0].count, status: "resolve" });
        })
        .catch((error) => {
            usePredicBuildingStore.setState({ error: errorHelper(error), status: "reject" });
            toast.error("Terjadi kesalahan");
        });
};

export const getDataListSurveyor = () => {
    useListSurveyor.setState({ status: "pending" });
    getVendor()
        .then((result) => {
            const surveyor = result?.map((e) => ({ label: e.keterangan, value: e.surveyor }));
            useListSurveyor.setState({ list: surveyor, status: "resolve" });
        })
        .catch((err) => {
            useListSurveyor.setState({ status: "reject", error: errorHelper(err) });
            toast.error(err);
        });
};

interface GetStreet {
    street: string;
    postalCode: string;
}

export const getStreetDrawing = (latLng: LatLng): Promise<GetStreet> => {
    return new Promise((resolve) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (response) => {
                const postalCode = response?.[0].address_components.filter((x) => x.types[0] == "postal_code") || 0;
                const street = response?.[0].formatted_address;
                resolve({ postalCode: postalCode ? postalCode[0]["long_name"] : "", street: street || "" });
            });
        } catch {
            resolve({ street: "", postalCode: "" });
        }
    });
};

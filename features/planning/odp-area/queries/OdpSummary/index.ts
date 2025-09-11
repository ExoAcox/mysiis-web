import { getKelurahanGeom } from "@api/district/metadata";

import {
    googleMapsOdpShummary,
    mainMarkerOdpAreaOdpSummary,
    odpAreaInfoWindowsOdpSumaary,
    odpAreaPolygonsOdpSumaary,
    polygonKelurahanOdpAreaOdpSummary,
} from "@pages/planning/odp-area/odp-summary";

import { parseLatLng } from "@functions/maps";
import { toast } from "react-toastify";
import { useOdpSummaryStore, useOdpUimValinsStore } from "../../store";
import { fetchSummaryOdpUimValins } from "../summary_odp_uim_valins";

export const clearDataOdpSummary = () => {
    if (polygonKelurahanOdpAreaOdpSummary) {
        polygonKelurahanOdpAreaOdpSummary.setMap(null);
        polygonKelurahanOdpAreaOdpSummary.setOptions({
            strokeWeight: 2,
            strokeColor: "#FF3300",
            fillOpacity: 0,
            clickable: false,
        });
    }
    odpAreaPolygonsOdpSumaary.forEach((x) => x.setMap(null));
    odpAreaPolygonsOdpSumaary.length = 0;
    useOdpSummaryStore.getState().reset();
    useOdpUimValinsStore.getState().reset();
};

let store: StorePolygon;

export const fetchDataOdpSummary = async (latLng: LatLng, source: string | undefined) => {
    clearDataOdpSummary();

    googleMapsOdpShummary.panTo(latLng);
    mainMarkerOdpAreaOdpSummary.setPosition(latLng);
    if (googleMapsOdpShummary.getZoom()! < 13) googleMapsOdpShummary.setZoom(13);
    try {
        const polygons = await getKelurahanGeom(latLng);
        polygons.forEach((data, i): void => {
            const geom: string = data?.geom ? data.geom : "";
            const polygonLayer = parseLatLng(geom);
            const polygon: StorePolygon = new window.google.maps.Polygon({
                map: googleMapsOdpShummary,
                paths: polygonLayer,
                strokeWeight: 2,
                strokeColor: "#ff4400",
                fillOpacity: 0,
            });

            polygon.addListener("click", () => {
                const infoWindow: any = odpAreaInfoWindowsOdpSumaary.find(
                    (window: any) => window.data.kode_desa_dagri === data.kode_desa_dagri
                );
                if (store != undefined) {
                    store.setOptions({ strokeColor: "#ff4400", zIndex: 1 });
                    const infoWindowLast: any = odpAreaInfoWindowsOdpSumaary.find(
                        (window: any) => window.data.kode_desa_dagri === store?.kode_desa_dagri
                    );
                    infoWindowLast && infoWindowLast.setMap(null);
                }
                store = polygon;
                polygon.setOptions({ strokeColor: "#0051ff", zIndex: 2 });
                if (infoWindow) {
                    infoWindow.setOptions({
                        content: `<div">${infoWindow.data.odp_uim_count ? ((infoWindow.data.odp_valins_count / infoWindow.data.odp_uim_count) * 100).toFixed(2) : 0
                            }%</div>`,
                    });
                    useOdpSummaryStore.setState({ data: { ...data, ...infoWindow.data } });
                    infoWindow.setMap(googleMapsOdpShummary);
                }
            });

            polygon.kelurahan = data.kelurahan;
            polygon.kecamatan = data.kecamatan;
            polygon.kode_desa_dagri = data.kode_desa_dagri;

            if (source == "odp-summary" && i === 0) {
                fetchSummaryOdpUimValins(data.provinsi, data.kota);
            }
            odpAreaPolygonsOdpSumaary.push(polygon);
        });
    } catch (error: any) {
        toast.error(error?.message || 'Network Error')
    }
};
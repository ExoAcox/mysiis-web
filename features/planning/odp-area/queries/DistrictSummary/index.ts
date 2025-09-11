
import { getKelurahanGeom } from "@api/district/metadata";
import {
    districtSummaryInfoWindows,
    districtSummaryPolygons,
    googleMapsDistrictSummary,
    mainMarkerDistrictSummary
} from "@pages/planning/odp-area/district-summary";
import { parseLatLng } from "@functions/maps";
import { toast } from "react-toastify";
import { useDistrictSummaryStore, useSummaryPenetrasiOdpBuildingStore, useSummaryTable } from "../../store";
import { fetchSummaryPenetrasiOdpBuilding } from "../summary_penetration_odp_building";

export const clearDataDistrictSummary = () => {
    if (districtSummaryPolygons) {
        districtSummaryPolygons.forEach((x) => x.setMap(null));
        districtSummaryPolygons.length = 0;
    }
    useDistrictSummaryStore.getState().reset();
    useSummaryPenetrasiOdpBuildingStore.getState().reset();
    useSummaryTable.getState().reset();
};

let store: StorePolygon;
export const fetchKabupatenDagri = async (latLng: LatLng) => {
    clearDataDistrictSummary();

    try {
        googleMapsDistrictSummary.panTo(latLng);
        mainMarkerDistrictSummary.setPosition(latLng);

        const polygons = await getKelurahanGeom(latLng);
        fetchSummaryPenetrasiOdpBuilding(polygons[0].provinsi, polygons[0].kota);
        polygons.forEach((data): void => {
            const geom: string = data?.geom ? data.geom : "";
            const polygonLayer = parseLatLng(geom)
            const polygon: StorePolygon = new window.google.maps.Polygon({
                map: googleMapsDistrictSummary,
                paths: polygonLayer,
                strokeWeight: 2,
                strokeColor: "#ff4400",
                fillOpacity: 0,
            });

            polygon.kelurahan = data.kelurahan;
            polygon.kecamatan = data.kecamatan;
            polygon.kode_desa_dagri = data.kode_desa_dagri;
            polygon.addListener("click", () => {
                const infoWindow: any = districtSummaryInfoWindows.find(
                    (window: any) => window.data.kode_desa_dagri === data?.kode_desa_dagri
                );
                if (store != undefined) {
                    store.setOptions({ strokeColor: "#ff4400", zIndex: 1 });
                    const infoWindowLast: any = districtSummaryInfoWindows.find(
                        (window: any) => window.data.kode_desa_dagri === store?.kode_desa_dagri
                    );
                    infoWindowLast && infoWindowLast.setMap(null);
                }
                store = polygon;
                polygon.setOptions({ strokeColor: "#0051ff", zIndex: 2 });
                const element = document.getElementById("mode-district-summary");
                if (infoWindow) {
                    infoWindow.setOptions({
                        content: `<div>${infoWindow.data.building_count
                            ? element?.dataset.mode === "penetration"
                                ? (
                                    ((infoWindow.data.odp_deviceportnumber - infoWindow.data.odp_portidlenumber) / infoWindow.data.building_count) *
                                    100
                                ).toFixed()
                                : infoWindow.data.penetrasi_percent.toFixed(2)
                            : 0
                            }%</div>`,
                    });
                    useDistrictSummaryStore.setState({ data: { ...data, ...infoWindow.data }, status: "resolve" });
                    infoWindow.setMap(googleMapsDistrictSummary);
                }
            });

            districtSummaryPolygons.push(polygon);
        });
        if (googleMapsDistrictSummary.getZoom()! < 12) googleMapsDistrictSummary.setZoom(12);
    } catch (error: any) {
        toast.error(error?.message || 'Network Error', {
            autoClose: 5000,
        })
    }
};

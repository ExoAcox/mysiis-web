import { getOdpUimMiniByKabupaten, OdpUimMiniByKabupaten } from "@api/odp";
import { errorHelper } from "@functions/common";
import { googleMapsDistrictOdp, heatmapOdpAreaDistrictOdp, polygonKelurahanOdpAreaDistrictOdp } from "@pages/planning/odp-area/district-odp";
import { useDistrictHeatmapStore } from "../store";

const fetchOdpUimMiniByKabupaten = async (provinsi: string, kota: string, source: string) => {
    useDistrictHeatmapStore.setState({ status: 'pending' })
    try {
        const odp_kabupaten = await getOdpUimMiniByKabupaten({ provinsi, kota });
        useDistrictHeatmapStore.setState({ data: odp_kabupaten, status: 'resolve' })
        if (source == 'district-heatmap') showHeatmap(odp_kabupaten)
    } catch (error) {
        useDistrictHeatmapStore.setState({ status: 'reject', error: errorHelper(error) })
    }
};

const showHeatmap = (odp_kabupaten: OdpUimMiniByKabupaten[]) => {
    polygonKelurahanOdpAreaDistrictOdp.setOptions({
        strokeWeight: 1,
        strokeOpacity: 0.2,
        strokeColor: "#0051ff",
    })

    const heatmapData: LatLngFunction[] = odp_kabupaten.map((map) => {
        return new window.google.maps.LatLng(map.lat, map.long);
    });

    const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
        map: googleMapsDistrictOdp,
        data: heatmapData,
    });

    heatmapOdpAreaDistrictOdp.push(newHeatmap);
    if (googleMapsDistrictOdp.getZoom() != 13) googleMapsDistrictOdp.setZoom(13);
}

export {
    fetchOdpUimMiniByKabupaten,
    showHeatmap
};

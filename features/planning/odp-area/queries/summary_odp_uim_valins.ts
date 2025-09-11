import { summaryOdpUimValins } from "@api/district/summary";

import { odpAreaInfoWindowsOdpSumaary, odpAreaPolygonsOdpSumaary } from "@pages/planning/odp-area/odp-summary";

import { useOdpUimValinsStore } from "../store";

const fetchSummaryOdpUimValins = async (provinsi: string, kota: string) => {
    try {
        const data_shummary = await summaryOdpUimValins(provinsi, kota);
        data_shummary.forEach((data) => {
            const infoWindow: any = new window.google.maps.InfoWindow({
                content: `<div ">${data.odp_uim_count ? ((data.odp_valins_count / data.odp_uim_count) * 100).toFixed(2) : 0}%</div>`,
                zIndex: 3,
                position: { lat: data.lat, lng: data.long },
            });

            infoWindow.data = data;
            odpAreaInfoWindowsOdpSumaary.push(infoWindow);

            const polygon: any = odpAreaPolygonsOdpSumaary.find(
                (poly: any) => poly.kode_desa_dagri === data.kode_desa_dagri
            );
            if (polygon) {
                const penetrasi: any = data.odp_uim_count ? ((data.odp_valins_count / data.odp_uim_count) * 100).toFixed(2) : 0;
                let color;
                if (penetrasi === 0 || penetrasi == 0.00) {
                    color = "#2B2A3A";
                } else if (penetrasi <= 10) {
                    color = "#652794";
                } else if (penetrasi <= 40) {
                    color = "#863C84";
                } else if (penetrasi > 40 && penetrasi <= 70) {
                    color = "#B14C79";
                } else if (penetrasi > 70 && penetrasi <= 99) {
                    color = "#D86161";
                } else if (penetrasi > 100) {
                    color = "#F38840";
                } else {
                    color = "#2B2A3A";
                }
                polygon.setOptions({ fillColor: color, fillOpacity: 0.7 });
                polygon.data = data;
            }
        });
        useOdpUimValinsStore.setState({ data: data_shummary });
    } catch (error) { }
};

export { fetchSummaryOdpUimValins };

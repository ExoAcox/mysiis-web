import { googleMaps, polygonsKota } from "@pages/planning/speedtest-ookla/agregat-speedtest";
import { getKabupatenDetail } from "@api/district/metadata";
import { AgregatMaping } from "./kota";
import { parseFromWK } from 'wkt-parser-helper';
import { fetchKelurahan } from "@features/planning/speedtest-ookla/queries/agregat";

interface FetchKabupatenDetail {
    code: number;
}

const fetchKabupatenDetail = async (args: FetchKabupatenDetail) => {
    const { code } = args

    polygonsKota.forEach((polygon) => polygon.setMap(null));

    try {
        const kabupaten = await getKabupatenDetail(code);

        kabupaten.map((data) => {
            const geom: string = data?.polygon_kel ? data.polygon_kel : "";
            const paths = parseFromWK(geom).coordinates[0].map((x: AgregatMaping) => ({ lat: x[1], lng: x[0] }));
            const polygon = new window.google.maps.Polygon({
                map: googleMaps,
                paths: paths,
                strokeWeight: 2,
                strokeColor: "#ff4400",
                fillOpacity: 0,
                fillColor: "#0747A6",
                clickable: true,
            });

            polygon.addListener("mouseover", () => {
                polygon.setOptions({ strokeColor: "#0747A6", fillOpacity: 0.35,  zIndex: 10 });
            });

            polygon.addListener("mouseout", () => {
                polygon.setOptions({ strokeColor: "#ff4400", fillOpacity: 0, zIndex: 1 });
            });

            polygon.addListener("click", (e: MapMouseEvent) => {
                fetchKelurahan({
                    latLng: { lat: e.latLng!.lat(), lng: e.latLng!.lng() }
                });
            });

            polygonsKota.push(polygon);
        });
    } catch (error) {}
}

export default fetchKabupatenDetail;
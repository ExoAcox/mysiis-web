import { toast } from "react-toastify";

import { token } from "@libs/axios";

import { generateToken, getDataMicrodemand, getPolygonMicrodemand } from "@api/survey-demand/mysiista";

import { googleMapsMysiista, markerUsersMySiista, polygonsOdpMySiista } from "@pages/planning/mysiista";

import { checkStatus, infoWindowContentUser } from "../../function";

const minZoomExtend = 15;
interface DataToken {
    token: string;
}

const fetchDataPolygon = async (data_token_: DataToken) => {
    if (googleMapsMysiista.getZoom()! > minZoomExtend) {
        try {
            const body = {
                f: "json",
                outFields: "*",
                where: "1=1",
                returnGeometry: true,
                rollbackOnFailure: true,
                geometry: JSON.stringify({
                    xmin: googleMapsMysiista.getBounds()!.getSouthWest().lng(),
                    ymin: googleMapsMysiista.getBounds()!.getSouthWest().lat(),
                    xmax: googleMapsMysiista.getBounds()!.getNorthEast().lng(),
                    ymax: googleMapsMysiista.getBounds()!.getNorthEast().lat(),
                    spatialReference: { wkid: 4326 },
                }),
                geometryType: "esriGeometryEnvelope",
                inSR: 4326,
                outSR: 4326,
                resultRecordCount: 2000,
                token: data_token_.token,
            };
            const data_polygons = await getPolygonMicrodemand(body);
            if (data_polygons.length > 0) {
                polygonsOdpMySiista.forEach((x) => {
                    x.setMap(null);
                });
                polygonsOdpMySiista.length = 0;
                data_polygons.forEach((element) => {
                    const coorArr: { lat: number; lng: number }[] = [];
                    const coordinates = element.geometry.rings[0];
                    coordinates.map((item) => coorArr.push({ lat: item[1], lng: item[0] }));
                    const polygon: Polygon = new window.google.maps.Polygon({
                        map: googleMapsMysiista,
                        paths: coorArr,
                        strokeWeight: 2,
                        strokeColor: "#ff4400",
                        fillOpacity: 0,
                        clickable: false,
                    });

                    polygonsOdpMySiista.push(polygon);
                });
            }
        } catch (error) {
            toast.error("Terjadi kesalahan");
        }
    } else {
        polygonsOdpMySiista.forEach((x) => {
            x.setMap(null);
        });
        polygonsOdpMySiista.length = 0;
    }
};

const fetchDataMicrodemand = async (data_token_: DataToken) => {
    if (googleMapsMysiista.getZoom()! > minZoomExtend) {
        try {
            const body = {
                f: "json",
                outFields: "*",
                where: "1=1",
                returnGeometry: true,
                rollbackOnFailure: true,
                geometry: JSON.stringify({
                    xmin: googleMapsMysiista.getBounds()!.getSouthWest().lng(),
                    ymin: googleMapsMysiista.getBounds()!.getSouthWest().lat(),
                    xmax: googleMapsMysiista.getBounds()!.getNorthEast().lng(),
                    ymax: googleMapsMysiista.getBounds()!.getNorthEast().lat(),
                    spatialReference: { wkid: 4326 },
                }),
                geometryType: "esriGeometryEnvelope",
                inSR: 4326,
                outSR: 4326,
                resultRecordCount: 2000,
                token: data_token_.token,
            };
            const dataUsers = await getDataMicrodemand(body);
            dataUsers.forEach((users) => {
                const Icon = checkStatus(users.attributes.status);
                const marker: Marker = new window.google.maps.Marker({
                    map: googleMapsMysiista,
                    position: { lat: users.geometry.y, lng: users.geometry.x },
                    icon: Icon,
                });
                marker.set("infoWindow", new window.google.maps.InfoWindow({ content: infoWindowContentUser(users.attributes) }));
                marker.addListener("click", () => {
                    markerUsersMySiista.forEach((marker) => marker.get("infoWindow").close());
                    marker.get("infoWindow").open(googleMapsMysiista, marker);
                });
                marker.addListener("mouseout", () => {
                    markerUsersMySiista.forEach((marker) => marker.get("infoWindow").close());
                });
                markerUsersMySiista.push(marker);
            });
        } catch (error) {
            toast.error("Terjadi Kesalahan");
        }
    } else {
        markerUsersMySiista.forEach((x) => x.setMap(null));
        markerUsersMySiista.length = 0;
    }
};

export const fetchDataToken = async () => {
    if (googleMapsMysiista.getZoom()! > minZoomExtend) {
        const accessToken = token();
        try {
            const token = await generateToken({ accessToken });
            fetchDataPolygon(token);
            fetchDataMicrodemand(token);
        } catch (error) { }
    }
};

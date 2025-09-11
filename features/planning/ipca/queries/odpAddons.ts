import { RefObject } from "react";
import { toast } from "react-toastify";

import { Ipca, UimIpcaById, getBuildingIpcaById, getIpcaByWitel, getUimIpcaById } from "@api/addons/ipca";
import { getKelurahanByLocation } from "@api/district/metadata";

import { errorHelper } from "@functions/common";

import { googleMapsIpca, markerOdps, polygonIpca, polygonIpcaBuilding } from "@pages/planning/ipca";

import { SheetRef } from "@components/navigation/BottomSheet";

import { formatAllOdp } from "../functions/common";
import { useAllBuildingData, useAllOdpData, useDefaultAllDataOdpStore, useIpcaStore, useOdpData, usePolygonStore } from "../store/cummon";
import { useSource } from "../store/filter";

const clearDataPolygon = () => {
    polygonIpca.forEach((x) => x.setMap(null));
    polygonIpca.length = 0;
    usePolygonStore.setState({ status: "idle" });
};
const clearDataMaps = () => {
    if (markerOdps.length > 0) {
        markerOdps.forEach((odp) => odp.setMap(null));
        markerOdps.length = 0;
        useOdpData.getState().reset();
        useAllOdpData.getState().reset();
    }
    if (polygonIpcaBuilding.length > 0) {
        polygonIpcaBuilding.forEach((building) => building.setMap(null));
        polygonIpcaBuilding.length = 0;
    }
};

type SheetRefType = RefObject<SheetRef> | boolean | any;

const fetchOdpAddOns = async (args: { regional: string; witel: string; sheetRef?: SheetRefType }) => {
    clearDataPolygon();
    clearDataMaps();
    useIpcaStore.setState({ status: "pending" });
    try {
        const clusters = await getIpcaByWitel({ regional: args?.regional, witel: args?.witel });
        const coordinate: LatLng[] = [];
        clusters.forEach((cluster) => {
            const paths = cluster.geom
                ?.slice(11, -2)
                .split(", ")
                .map((row) => {
                    const split = row.split(" ");
                    return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                });

            const priority = cluster.status_priority === "PRIORITY";

            const polygon = new window.google.maps.Polygon({
                map: googleMapsIpca,
                paths: paths,
                strokeWeight: 1,
                strokeColor: priority ? "#EE3124" : "#7D4AEA80",
                fillColor: priority ? "#EE3124" : "#7D4AEA80",
                fillOpacity: 0.3,
                zIndex: 3,
            });

            coordinate.push(paths![0]);
            polygon.addListener("click", () => {
                const source = useSource.getState().source;
                if (source == "odp") {
                    fetchOdpUimIpca(cluster);
                    args.sheetRef && args.sheetRef.current!.snapTo(180);
                } else fetchBuildingIpca(cluster);
            });

            polygonIpca.push(polygon);
        });
        useIpcaStore.setState({ data: clusters, status: "resolve" });
        googleMapsIpca.setZoom(13);
        googleMapsIpca.setCenter(coordinate[0]);
    } catch (error) {
        toast.error("Terjadi Kesalahan");
        useIpcaStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

const fetchOdpUimIpca = async (cluster: Ipca) => {
    clearDataMaps();
    usePolygonStore.setState({ status: "pending" });
    useAllOdpData.setState({ status: "pending" });
    try {
        const odpUim = await getUimIpcaById(cluster.id_project!);
        showDistrictOdp(odpUim);
        useAllOdpData.setState({ data: formatAllOdp(odpUim), status: "resolve" });
        useDefaultAllDataOdpStore.setState({ data: odpUim, status: "resolve" });
        usePolygonStore.setState({ data: cluster, status: "resolve" });
        googleMapsIpca.setCenter({ lat: odpUim[0].lat, lng: odpUim[0].long });
    } catch (error) {
        usePolygonStore.setState({ status: "reject" });
        useAllOdpData.setState({ status: "reject", error: errorHelper(error) });
    }
};

const showDistrictOdp = (odpUim: UimIpcaById[]) => {
    if (googleMapsIpca.getZoom()! < 16) googleMapsIpca.setZoom(16);
    odpUim.forEach((data) => {
        let color;
        switch (data.status_occ) {
            case "RED":
                color = "red";
                break;
            case "ORANGE":
                color = "orange";
                break;
            case "YELLOW":
                color = "yellow";
                break;
            case "GREEN":
                color = "green";
                break;
            default:
                color = "black";
        }

        const marker = new window.google.maps.Marker({
            map: googleMapsIpca,
            position: { lat: data.lat, lng: data.long },
            icon: {
                anchor: new window.google.maps.Point(10, 10),
                url: `data:image/svg+xml;utf-8, \
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> \
                <circle cx="10" cy="10" r="${data.status_occ === "BLACK_SYSTEM" ? 6 : 8}" fill="${color}" ${
                    data.status_occ === "BLACK_SYSTEM" ? `stroke="green" stroke-width="4"` : ""
                }></circle> \
          </svg>`,
            },
        });

        marker.set("name", data.devicename);

        const content = `
        <div " id="infowindow">
          <table >
            <tr>
              <td>Device ID <span>:</span></td>
              <td><b>${data.device_id}</b></td>
            </tr>
            <tr>
              <td>Device Name <span>:</span></td>
              <td><b>${data.devicename}</b></td>
            </tr>
            <tr>
              <td>Status <span>:</span></td>
              <td><b>${data.status_occ}</b></td>
            </tr>
            <tr>
              <td>Device Port <span>:</span></td>
              <td><b>${data.portinservicenumber}</b></td>
            </tr>
            <tr>
              <td>Idle Port <span>:</span></td>
              <td><b>${data.portidlenumber}</b></td>
            </tr>
            <tr>
              <td>Install Date <span>:</span></td>
              <td><b>${data.odp_install}</b></td>
            </tr>
          </table>
        </div>
      `;

        const infowindow = new window.google.maps.InfoWindow({
            content,
            zIndex: 2,
        });

        marker.set(
            "infoWindow",
            new window.google.maps.InfoWindow({
                content: content,
            })
        );

        marker.addListener("mouseover", () => {
            infowindow.open(googleMapsIpca, marker);
        });

        marker.addListener("mouseout", () => {
            infowindow.close();
        });

        marker.addListener("click", () => {
            useOdpData.setState({ data: data, status: "resolve" });
        });
        markerOdps.push(marker);
    });
};

const fetchBuildingIpca = async (cluster: Ipca) => {
    clearDataMaps();
    usePolygonStore.setState({ status: "pending" });
    try {
        const buildings = await getBuildingIpcaById(cluster.id_project!);
        usePolygonStore.setState({ status: "resolve" });
        buildings.forEach((cluster) => {
            const paths = cluster.geom
                ?.slice(11, -2)
                .split(", ")
                .map((row) => {
                    const split = row.split(" ");
                    return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                });

            const polygon = new window.google.maps.Polygon({
                map: googleMapsIpca,
                paths: paths,
                strokeWeight: 2,
                strokeColor: "#BB0018",
                fillColor: "#BB0018",
                fillOpacity: 0.3,
                zIndex: 3,
            });

            polygonIpcaBuilding.push(polygon);
        });
        usePolygonStore.setState({ data: cluster, status: "resolve" });
        useAllBuildingData.setState({ data: buildings, status: "resolve" });
    } catch (error) {
        usePolygonStore.setState({ status: "reject" });
        useAllBuildingData.setState({ status: "reject", error: errorHelper(error) });
    }
};

const fetchKelurahan = async (latLng: LatLng, sheetRef?: SheetRefType) => {
    try {
        const location = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });
        fetchOdpAddOns({ regional: location.regional, witel: location.witel, sheetRef });
    } catch (error) {
        toast.error("Terjadi Kesalahan");
    }
};

export { fetchOdpAddOns, fetchOdpUimIpca, fetchBuildingIpca, fetchKelurahan, clearDataMaps, clearDataPolygon };

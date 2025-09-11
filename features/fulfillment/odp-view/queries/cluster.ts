import { getIpcaByWitel } from "@api/addons/ipca";

import { useModalOutside } from "@hooks/useModal";

import { errorHelper } from "@functions/common";

import { googleMaps, polygonClusters } from "@pages/fulfillment/odp-view";

import { useClusterStore } from "../store";

interface FetchCluster {
    regional: string;
    witel: string;
}

const fetchCluster = async (args: FetchCluster) => {
    const { regional, witel } = args;

    useClusterStore.setState({ data: 0, status: "pending", error: null });

    try {
        const clusters = await getIpcaByWitel({ regional, witel });

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
                map: googleMaps,
                paths: paths,
                strokeWeight: 1,
                strokeColor: priority ? "red" : "blue",
                fillColor: priority ? "red" : "blue",
                fillOpacity: 0.3,
                zIndex: 3,
            });

            polygon.addListener("click", () => {
                useModalOutside("odp-view/cluster", { visible: true, data: cluster });
            });

            polygonClusters.push(polygon);
        });

        useClusterStore.setState({ data: clusters.length, status: "resolve" });
    } catch (error) {
        useClusterStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchCluster;

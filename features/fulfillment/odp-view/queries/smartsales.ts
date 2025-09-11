import { getSmartSales } from "@api/odp/smartsales";

import { useModalOutside } from "@hooks/useModal";

import { errorHelper } from "@functions/common";

import { googleMaps, polygonSmartSales } from "@pages/fulfillment/odp-view";

import { getColor } from "@features/fulfillment/odp-view/functions/smartsales";

import { useSmartSalesStore } from "../store";

interface FetchSmartSales {
    kode_desa_dagri: string;
}

const fetchSmartSales = async (args: FetchSmartSales) => {
    const { kode_desa_dagri } = args;

    useSmartSalesStore.setState({ data: 0, status: "pending", error: null });

    try {
        const smartSales = await getSmartSales({ kode_desa_dagri });
        const smartSalesList = smartSales.lists;

        smartSalesList.forEach((data) => {
            const isZm = data.geom_grid!.includes("POLYGON ZM");

            const paths = data
                .geom_grid!.slice(isZm ? 14 : 11, -2)
                .replaceAll(" 0.00000000 nan", "")
                .split(", ")
                .map((row) => {
                    const split = row.split(" ");
                    return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
                });

            const polygon = new window.google.maps.Polygon({
                map: googleMaps,
                paths: paths,
                strokeWeight: 1,
                strokeColor: "#000",
                fillOpacity: 0.5,
                fillColor: getColor(data.segment_score_cap_ok),
                zIndex: 3,
            });

            polygon.addListener("click", () => {
                useModalOutside("odp-view/smartsales", { visible: true, data });
            });

            polygonSmartSales.push(polygon);
        });

        useSmartSalesStore.setState({ data: smartSales.total_count, status: "resolve" });
    } catch (error) {
        useSmartSalesStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchSmartSales;

import { getPolygon, getPolygonCount, getPolygonTsel, GetPolygonTselProps } from "@api/survey-demand/mysiista";

import { errorHelper } from "@functions/common";

import { usePolygonStore } from "../../store/global";
import { usePolygonTselStore, usePolygonCountStore, defaultCountPolygon } from "../../store/polygon";

export const fetchPolygon = async (supervisorId: string) => {
    usePolygonStore.setState({ data: [], status: "pending", error: null });

    try {
        const polygons = await getPolygon(supervisorId);
        usePolygonStore.setState({ data: polygons, status: "resolve" });
    } catch (error) {
        usePolygonStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export const fetchPolygonTselFilter = async (params : GetPolygonTselProps, isSamePage?: string) => {
    usePolygonStore.setState({ data: [], status: "pending", error: null });

    try {
        const result = await getPolygonTsel(params);
        usePolygonStore.setState({ data: result.data, status: "resolve" });
    } catch (error) {
        usePolygonStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export const fetchPolygonTsel = async (params : GetPolygonTselProps, isSamePage?: string) => {
    usePolygonTselStore.setState({ data: [], status: "pending", error: null });

    if(params.search === "") delete params.search;

    try {
        if(params.status === "") delete params.status;
        const result = await getPolygonTsel(params);
        
        usePolygonTselStore.setState({ data: result.data, totalData: result.totalData, status: "resolve" });
    } catch (error) {
        usePolygonTselStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export const fetchPolygonCount = async (params : {
    area?: string;
    region?: string;
    branch?: string;
    vendor?: string;
}, isSamePage?: string) => {
    usePolygonCountStore.setState({ data: defaultCountPolygon, totalData:0, status: "pending", error: null });

    try {
        const response = await getPolygonCount(params);

        usePolygonCountStore.setState({ data: response.result, totalData: response.totalData, status: "resolve" });
    } catch (error) {
        usePolygonCountStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

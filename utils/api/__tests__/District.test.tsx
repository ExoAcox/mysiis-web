import { getDirection } from "@api/district/direction";
import {
    getKabupaten,
    getKabupatenDagri,
    getKabupatenDetail,
    getKecamatan,
    getKelurahan,
    getKelurahanByLocation,
    getNcx,
    getNcxMiss,
    getProvinsi,
    getStreet,
    getSummaryNcxMiss,
    searchTMaps,
} from "@api/district/metadata";
import { getOdc, getRegional, getSto, getWitel, getRegionTsel, getBranchTsel } from "@api/district/network";
import { summaryOdpUimValins, summaryPenetrasiOdpBuilding } from "@api/district/summary";

import { fetch } from "@functions/test";

test("getDirection", async () => {
    fetch({ method: "get", func: getDirection, result: { data: { data: { features: [true] } } } });
});

test("searchTMaps", async () => {
    fetch({ method: "get", func: searchTMaps });
});

test("getKelurahanByLocation", async () => {
    fetch({ method: "get", func: getKelurahanByLocation });
});

test("getKabupatenDagri", async () => {
    fetch({ method: "get", func: getKabupatenDagri, result: { data: { data: [true] } } });
});

test("getKabupatenDetail", async () => {
    fetch({ method: "get", func: getKabupatenDetail });
});

test("getProvinsi", async () => {
    fetch({ method: "get", func: getProvinsi });
});

test("getKabupaten", async () => {
    fetch({ method: "get", func: getKabupaten });
});

test("getKecamatan", async () => {
    fetch({ method: "get", func: getKecamatan });
});

test("getKelurahan", async () => {
    fetch({ method: "get", func: getKelurahan });
});

test("getNcx", async () => {
    fetch({ method: "get", func: getNcx });
});

test("getStreet", async () => {
    fetch({ method: "get", func: getStreet });
});

test("getNcxMiss", async () => {
    fetch({ method: "get", func: getNcxMiss });
});

test("getSummaryNcxMiss", async () => {
    fetch({ method: "get", func: getSummaryNcxMiss });
});

test("getRegional", async () => {
    fetch({ method: "get", func: getRegional });
});

test("getWitel", async () => {
    fetch({ method: "get", func: getWitel, args: { regional: "regional" } });
});

test("getRegionTsel", async () => {
    fetch({ method: "get", func: getRegionTsel, args: { regional: "regional" } });
});

test("getBranchTsel", async () => {
    fetch({ method: "get", func: getBranchTsel, args: { regional: "regional" } });
});

test("getSto", async () => {
    fetch({ method: "get", func: getSto });
});

test("getOdc", async () => {
    fetch({ method: "get", func: getOdc });
});

test("summaryOdpUimValins", async () => {
    fetch({ method: "get", func: summaryOdpUimValins });
});

test("summaryPenetrasiOdpBuilding", async () => {
    fetch({ method: "get", func: summaryPenetrasiOdpBuilding });
});

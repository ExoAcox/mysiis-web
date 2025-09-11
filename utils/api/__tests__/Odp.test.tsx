import { getOdp, getOdpUimByKelurahan, getOdpUimMiniByKabupaten, getPackage } from "@api/odp";
import { getAllCompetitor, getCompetitorSummary, getRegionalCompetitor, getSummaryByRegional, getWitelCompetitor } from "@api/odp/competitor";
import { getCustomerId, getOdpCustomer } from "@api/odp/customer";
import { getSmartSales } from "@api/odp/smartsales";

import { fetch } from "@functions/test";

test("getOdp", async () => {
    fetch({ method: "get", func: getOdp });
});

test("getOdpUimByKelurahan", async () => {
    fetch({ method: "get", func: getOdpUimByKelurahan });
});

test("getOdpUimMiniByKabupaten", async () => {
    fetch({ method: "get", func: getOdpUimMiniByKabupaten });
});

test("getPackage", async () => {
    fetch({ method: "get", func: getPackage });
});

test("getAllCompetitor", async () => {
    fetch({ method: "get", func: getAllCompetitor });
});

test("getCompetitorSummary", async () => {
    fetch({ method: "get", func: getCompetitorSummary });
});

test("getRegionalCompetitor", async () => {
    fetch({ method: "get", func: getRegionalCompetitor });
});

test("getSummaryByRegional", async () => {
    fetch({ method: "get", func: getSummaryByRegional });
});

test("getWitelCompetitor", async () => {
    fetch({ method: "get", func: getWitelCompetitor });
});

test("getCustomerId", async () => {
    fetch({ method: "get", func: getCustomerId });
});

test("getOdpCustomer", async () => {
    fetch({ method: "get", func: getOdpCustomer });
});

test("getSmartSales", async () => {
    fetch({ method: "get", func: getSmartSales });
});

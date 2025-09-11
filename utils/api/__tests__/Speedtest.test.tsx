import { getOoklaByCoordinate, getOoklaByKelurahan, getSummaryOoklaByKelurahan } from "@api/speedtest/ookla";

import { fetch } from "@functions/test";

test("getOoklaByCoordinate", async () => {
    fetch({ method: "get", func: getOoklaByCoordinate });
});

test("getOoklaByKelurahan", async () => {
    fetch({ method: "get", func: getOoklaByKelurahan });
});

test("getSummaryOoklaByKelurahan", async () => {
    fetch({ method: "get", func: getSummaryOoklaByKelurahan });
});

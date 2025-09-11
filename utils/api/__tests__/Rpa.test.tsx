import { getDeviceConnected, getDeviceConnectedByNd } from "@api/rpa";
import { getPooling, getPoolingDetail, uploadPooling } from "@api/rpa/pooling";

import { fetch } from "@functions/test";

test("getDeviceConnected", async () => {
    fetch({ method: "get", func: getDeviceConnected });
});

test("getDeviceConnectedByNd", async () => {
    fetch({ method: "get", func: getDeviceConnectedByNd });
});

test("getPooling", async () => {
    fetch({ method: "get", func: getPooling });
});

test("getPoolingDetail", async () => {
    fetch({ method: "get", func: getPoolingDetail });
});

test("uploadPooling", async () => {
    fetch({ method: "post", func: uploadPooling });
});

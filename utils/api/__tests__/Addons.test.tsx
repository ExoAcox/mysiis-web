import { getBuildingIpcaById, getIpcaByWitel, getUimIpcaById } from "@api/addons/ipca";

import { fetch } from "@functions/test";

test("getIpcaByWitel", async () => {
    fetch({ method: "get", func: getIpcaByWitel });
});

test("getBuildingIpcaById", async () => {
    fetch({ method: "get", func: getBuildingIpcaById });
});

test("getUimIpcaById", async () => {
    fetch({ method: "get", func: getUimIpcaById });
});

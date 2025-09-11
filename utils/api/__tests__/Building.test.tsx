import { getBuildingByKelurahan } from "@api/building";

import { fetch } from "@functions/test";

test("getBuildingByKelurahan", async () => {
    fetch({ method: "get", func: getBuildingByKelurahan });
});

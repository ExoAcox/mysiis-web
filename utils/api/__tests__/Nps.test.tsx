import { getNps, submitNps } from "@api/nps";

import { fetch } from "@functions/test";

test("getNps", async () => {
    fetch({ method: "get", func: getNps });
});

test("submitNps", async () => {
    fetch({ method: "post", func: submitNps });
});

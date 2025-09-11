import { sendMessageWA } from "@api/oca";

import { fetch } from "@functions/test";

test("sendMessageWA", async () => {
    fetch({ method: "post", func: sendMessageWA });
});

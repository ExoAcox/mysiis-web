import { getNotification, readAllNotification, readNotification } from "@api/notification";

import { fetch } from "@functions/test";

test("getNotification", async () => {
    fetch({ method: "get", func: getNotification, result: { data: { data: true, meta: { count: true } } } });
});

test("readNotification", async () => {
    fetch({ method: "post", func: readNotification });
});

test("readAllNotification", async () => {
    fetch({ method: "post", func: readAllNotification });
});

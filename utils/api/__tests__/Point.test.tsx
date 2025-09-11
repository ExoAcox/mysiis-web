import { getMyVoucher, getMyWallet, getPointExchange, getTask, getVoucher, getWallet } from "@api/point";

import { fetch } from "@functions/test";

test("getMyVoucher", async () => {
    fetch({ method: "get", func: getMyVoucher });
});

test("getMyWallet", async () => {
    fetch({ method: "get", func: getMyWallet, result: { data: { data: { balance: true } } } });
});

test("getWallet", async () => {
    fetch({ method: "get", func: getWallet, result: { data: { data: { balance: true } } } });
});

test("getTask", async () => {
    fetch({ method: "get", func: getTask, result: { data: { data: { lists: true } } } });
});

test("getVoucher", async () => {
    fetch({ method: "get", func: getVoucher });
});

test("getPointExchange", async () => {
    fetch({ method: "post", func: getPointExchange });
});

import { getAllBanner, getAllNews, getNews } from "@api/news";

import { fetch } from "@functions/test";

test("getAllNews", async () => {
    fetch({ method: "get", func: getAllNews });
});

test("getNews", async () => {
    fetch({ method: "get", func: getNews, result: { data: { data: { lists: [true] } } } });
});

test("getAllBanner", async () => {
    fetch({ method: "get", func: getAllBanner, result: { data: { data: { lists: true } } } });
});

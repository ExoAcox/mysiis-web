import { getFaqAllCategoryActive, getFaqByCategory, getFaqByPopularity, getFaqBySearch, getPointDescription, getTermsCondition } from "@api/content";

import { fetch } from "@functions/test";

test("getFaqAllCategoryActive", async () => {
    fetch({ method: "get", func: getFaqAllCategoryActive });
});

test("getFaqByCategory", async () => {
    fetch({ method: "get", func: getFaqByCategory });
});

test("getFaqBySearch", async () => {
    fetch({ method: "get", func: getFaqBySearch, result: { data: { data: { lists: true } } } });
});

test("getFaqByPopularity", async () => {
    fetch({ method: "get", func: getFaqByPopularity, result: { data: { data: { lists: true } } } });
});

test("getPointDescription", async () => {
    fetch({ method: "get", func: getPointDescription });
});

test("getTermsCondition", async () => {
    fetch({ method: "get", func: getTermsCondition });
});

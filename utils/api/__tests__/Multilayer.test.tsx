import { getAllMultilayer } from "@api/multilayer/feedback";
import { getAllSentimentFeedback, testSentiment, uploadSentiment } from "@api/multilayer/sentiment-feedback";

import { fetch } from "@functions/test";

test("getAllMultilayer", async () => {
    fetch({ method: "get", func: getAllMultilayer });
});

test("getAllSentimentFeedback", async () => {
    fetch({ method: "get", func: getAllSentimentFeedback });
});

test("uploadSentiment", async () => {
    fetch({ method: "post", func: uploadSentiment });
});

test("testSentiment", async () => {
    fetch({ method: "post", func: testSentiment });
});

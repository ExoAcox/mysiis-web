import { axios, catchHelper } from "@libs/axios";

interface ChatbotFaq {
    uid: string;
    k: number;
    nd: string;
    input_query: string;
    last_topic_issue: string;
}

interface ChatbotFaqResponse {
    topic_issue: string;
    query: string;
    answer: string;
}

export const chatbotFaq = (args: ChatbotFaq): Promise<ChatbotFaqResponse> => {
    return new Promise((resolve, reject) => {
        axios
            .put("https://chatbot-faq.mysiis.io/chatbotfaq", args)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

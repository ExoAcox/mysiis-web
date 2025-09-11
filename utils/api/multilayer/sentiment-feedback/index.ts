import { AxiosProgressEvent } from "axios";
import getConfig from "next/config";

import { axios, catchHelper, header } from "@libs/axios";

let feedbackController: AbortController;

export interface GetAllSentimentFeedback {
    row: number;
    page: number;
    userid?: string | null;
    prediction?: string | null;
}

export interface ListAllSentimentFeedback {
    _id: string;
    userId: string;
    message: string;
    prediction: string;
    percentage_confident: string;
}

export interface AllSentimentFeedback {
    data: ListAllSentimentFeedback[];
    meta: { all_data: number; max_page: number };
}

export const getAllSentimentFeedback = (args: GetAllSentimentFeedback): Promise<AllSentimentFeedback> => {
    feedbackController?.abort();
    feedbackController = new AbortController();

    const { row = 10, page = 1, userid, prediction } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_MULTILAYER_URL + "/feedback/v1/predicts", {
                params: { row, page, userid, prediction },
                auth: { username: process.env.NEXT_PUBLIC_TELKOM_USERNAME, password: process.env.NEXT_PUBLIC_NPS_PASSWORD },
                signal: feedbackController.signal,
                cache: false,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface UploadSentiment {
    message: string[];
    userId: string;
}

interface UploadSentimentResponse {
    data: { message: string };
    message: string;
    success: boolean;
}

export const uploadSentiment = (args: UploadSentiment, onUploadProgress?: (event: AxiosProgressEvent) => void): Promise<UploadSentimentResponse> => {
    feedbackController?.abort();
    feedbackController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_MULTILAYER_URL + "/feedback/v1/predicts-json", args, {
                headers: { Authorization: header().Authorization },
                onUploadProgress,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface TestSentiment {
    text: string[];
}

export interface TestSentimentDataResponse {
    text: string;
    prediction: string;
    percentage_confident: string;
}

interface TestSentimentResponse {
    data: TestSentimentDataResponse[];
}

export const testSentiment = (args: TestSentiment): Promise<TestSentimentResponse> => {
    feedbackController?.abort();
    feedbackController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_SENTIMENT_URL + "/predict", args, {
                headers: { Authorization: header().Authorization },
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

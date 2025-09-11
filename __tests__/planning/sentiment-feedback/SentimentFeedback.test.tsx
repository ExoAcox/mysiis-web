import React from "react";
import { describe } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import SentimentFeedback from "@pages/planning/sentiment-feedback";

import { getPrediction } from "@features/planning/sentiment-feedback/functions/table";

const renderPage = (args?: { access?: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<SentimentFeedback user={user} access={access} />);

    return view;
};

const listAllSentimentFeedback = Array.from({ length: 11 }, (_, index) => {
    return {
        _id: `string ${index}`,
        userId: `string ${index}`,
        message: `string ${index}`,
        prediction: `string ${index}`,
        percentage_confident: `string ${index}`,
    };
});

const getAllSentimentFeedback = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                ...listAllSentimentFeedback,
                {
                    _id: null,
                    userId: null,
                    message: null,
                    prediction: null,
                    percentage_confident: null,
                },
            ],
            meta: { all_data: 11, max_page: 2 },
        },
    });
};

const testSentiment = (prediction: string, percentage_confident?: string) => {
    return axios.post.mockResolvedValueOnce({
        data: { data: [{ text: "string", prediction, percentage_confident }] },
    });
};

const uploadSentiment = () => {
    return axios.post.mockResolvedValueOnce({
        data: { data: { message: "string" }, message: "string", success: true },
    });
};

describe("Sentiment feedback page", () => {
    test("Test snapshot", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        const view = renderPage();
        view.asFragment();
    });

    test("Sentiment feedback filter data", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        getAllSentimentFeedback();
        const search = screen.getByPlaceholderText("Cari User ID");
        fireEvent.change(search, { target: { value: "cad14ddc-0e0c-4dc9-ae3c-ef412fa1a6ac" } });

        getAllSentimentFeedback();
        fireEvent.change(search, { target: { value: "" } });

        getAllSentimentFeedback();
        fireEvent.change(search, { target: { value: "cad14ddc-0e0c-4dc9-ae3c-ef412fa1a6ac" } });

        getAllSentimentFeedback();
        const icon = screen.getByTitle("reset-search");
        fireEvent.click(icon);

        const dropdownPrediction = await screen.findAllByText("Semua Prediksi");
        fireEvent.click(dropdownPrediction[0]);
        getAllSentimentFeedback();
        const chooseDropdownPrediction = await screen.findByText("Positif");
        fireEvent.click(chooseDropdownPrediction);

        fireEvent.click(chooseDropdownPrediction);
        getAllSentimentFeedback();
        fireEvent.click(dropdownPrediction[1]);
    });

    test("Sentiment feedback test api prediction close modal", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        await waitFor(() => testApiButton[0]);
    });

    test("Sentiment feedback test api error get prediction", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "gak bagus" } });

        axios.get.mockRejectedValueOnce({});
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);
    });

    test("Sentiment feedback test api prediction negative with percentage confident", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "gak bagus" } });

        testSentiment("negative", "100%");
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);

        await waitFor(() => screen.findByTestId("negative-prediction"));

        const tryAgainButton = screen.getByText("Test Ulang");
        fireEvent.click(tryAgainButton);
    });

    test("Sentiment feedback test api prediction negative without percentage confident", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "gak bagus" } });

        testSentiment("negative");
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);

        await waitFor(() => screen.findByTestId("negative-prediction"));

        const closeButton = screen.getByText("Tutup");
        fireEvent.click(closeButton);
    });

    test("Sentiment feedback test api prediction positive with percentage confident", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "bagus" } });

        testSentiment("positive", "100%");
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);

        await waitFor(() => screen.findByTestId("positive-prediction"));

        const tryAgainButton = screen.getByText("Test Ulang");
        fireEvent.click(tryAgainButton);
    });

    test("Sentiment feedback test api prediction positive without percentage confident", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "bagus" } });

        testSentiment("positive");
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);

        await waitFor(() => screen.findByTestId("positive-prediction"));

        const closeButton = screen.getByText("Tutup");
        fireEvent.click(closeButton);
    });

    test("Sentiment feedback test api prediction neutral with percentage confident", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "bagus" } });

        testSentiment("neutral", "100%");
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);

        await waitFor(() => screen.findByTestId("neutral-prediction"));

        const tryAgainButton = screen.getByText("Test Ulang");
        fireEvent.click(tryAgainButton);
    });

    test("Sentiment feedback test api prediction neutral without percentage confident", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const commentInput = screen.getByPlaceholderText("Tulis komentar Anda disini");
        fireEvent.change(commentInput, { target: { value: "bagus" } });

        testSentiment("neutral");
        const submitButton = screen.getByText("Kirim");
        fireEvent.click(submitButton);

        await waitFor(() => screen.findByTestId("neutral-prediction"));

        const closeButton = screen.getByText("Tutup");
        fireEvent.click(closeButton);
    });

    test("Sentiment feedback upload csv close modal", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllSentimentFeedback();
        getAllSentimentFeedback();

        renderPage();

        const uploadCsvButton = await screen.findByText("Upload CSV");
        fireEvent.click(uploadCsvButton);

        const uploadFileText = await screen.findByText("Upload File");
        await waitFor(() => uploadFileText);

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        await waitFor(() => uploadCsvButton);
    });

    test("Sentiment feedback mock getPrediction", async () => {
        const match = ["negative", "positive", "neutral"];

        match.map((item) => getPrediction(item));
    });
});

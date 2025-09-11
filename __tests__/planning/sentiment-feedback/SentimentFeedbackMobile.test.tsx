import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import SentimentFeedback from "@pages/planning/sentiment-feedback";

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

vi.mock("@hooks/useMediaQuery", () => ({
    default: () => ({ width: 567, isMobile: true }),
}));

describe("Sentiment feedback page mobile", () => {
    test("Test snapshot", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        const view = renderPage();
        view.asFragment();
    });

    test("Sentiment feedback data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();

        const testApiButton = await screen.findAllByText("Test API");
        fireEvent.click(testApiButton[0]);

        await waitFor(() => testApiButton[1]);

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        await waitFor(() => testApiButton[0]);
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
});

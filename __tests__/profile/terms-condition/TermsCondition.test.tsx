import React from "react";
import { describe } from "vitest";

import { axios, render, user } from "@functions/test";

import TermsCondition from "@pages/profile/terms-condition";

const renderPage = async (args?: { access: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<TermsCondition user={user} access={access} />);

    return view;
};

const getTermsCondition = () => {
    return axios.get.mockResolvedValueOnce({ data: { data: { description: { id: "id" } } } });
};

describe("Terms Condition page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getTermsCondition();

        const view = await renderPage();
        view.asFragment();
    });

    test("Terms condition page", async () => {
        getTermsCondition();

        await renderPage();
    });
});

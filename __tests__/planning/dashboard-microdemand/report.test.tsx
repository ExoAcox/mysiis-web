import dayjs from "dayjs";
import { describe, test } from "vitest";

import { axios, fireEvent, render, screen, waitFor } from "@functions/test";

import Report from "@pages/planning/dashboard-microdemand/report";

describe("Report Microdemand", () => {
    const user = {
        fullname: "Admin Regional",
        permission_keys: ["customer-location", "data-demand", "data-odp"],
        profilePicture: "",
        regional: "Regional 2",
        role_keys: ["admin-survey-regional", "nik"],
        userId: "askljdaoijdoiadj",
        uuid: "kandkasdjaijadsiads",
        vendor: "",
        witel: "All",
    };

    const fetchNotification = () =>
        axios.get.mockRejectedValueOnce({
            data: {
                data: [
                    {
                        notificationId: "string",
                        userId: "string",
                        taskId: "string",
                        title: "string",
                        body: "string",
                        category: "string",
                        key: "string",
                        action: "string",
                        status: "read",
                        sendAt: dayjs(new Date()).format("YYYY-MM-DD"),
                        readAt: dayjs(new Date()).format("YYYY-MM-DD"),
                    },
                ],
            },
            meta: {
                count: 20,
            },
        });

    const fetchDataWitel = () => axios.get.mockResolvedValueOnce({ data: { data: ["JAKARTA"] } });
    const fetchSurveyCategory = () =>
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    filteredCount: "string",
                    lists: [
                        {
                            group: "string",
                            id: 1234,
                            is_show: "string",
                            name: "kuisioner",
                        },
                    ],
                    totalCount: "string",
                },
            },
        });

    const getSurveyCount = () =>
        axios.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        respondent: {
                            invalid: 3,
                            unvalidated: "string",
                            valid: "string",
                            "valid-mitra": 3,
                        },
                        user: {
                            userId: "string",
                            fullname: "string",
                            customdata: {
                                vendor: "string",
                            },
                        },
                        supervisor: {
                            email: "string",
                            fullname: "string",
                            mobile: "string",
                            userId: "string",
                        },
                        polygon: {
                            name: "string",
                            witel: "string",
                            surveyor: "string",
                            target_household: 3,
                            objectid: 3,
                        },
                        treg: "string",
                        witel: "string",
                        status: "active",
                    },
                ],
            },
        });

    const getSurveyCountWitel = () =>
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    "REGIONAL 2": {
                        invalid: 238,
                        "invalid-mitra": 0,
                        total: 4607,
                        unvalidated: 0,
                        valid: 4369,
                        "valid-mitra": 0,
                    },
                },
            },
        });

    test("wrapper report admin-survey-regional", async () => {
        fetchNotification();
        fetchDataWitel();
        fetchSurveyCategory();
        getSurveyCount();
        getSurveyCountWitel();
        render(<Report user={user} device="desktop" />).asFragment();

        // const selectWitel = screen.getByText("Pilih Witel");
        // fireEvent.click(selectWitel);
        // const witel = await waitFor(() => screen.findByText("JAKARTA"));
        // fireEvent.click(witel);

        // const selectSurvey = screen.getByText("Pilih Survey");
        // fireEvent.click(selectSurvey);
        // const surveyor = await waitFor(() => screen.findByText("kuisioner"));
        // fireEvent.click(surveyor);
    });
});

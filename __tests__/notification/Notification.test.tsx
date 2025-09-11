import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import Notification from "@pages/notification";

const renderPage = async () => {
    const view = render(<Notification user={user} />);

    return view;
};

const getNotification = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    notificationId: "string 1",
                    userId: "string 1",
                    taskId: "string 1",
                    title: "Title 1",
                    body: "string 1",
                    category: "info",
                    key: "string 1",
                    action: "POINT_CURRENT_MONTH",
                    status: "unread",
                    sendAt: "2012-12-12",
                    readAt: "2012-12-12",
                },
                {
                    notificationId: "string 2",
                    userId: "string 2",
                    taskId: "string 2",
                    title: "Title 2",
                    body: "string 2",
                    category: "point",
                    key: "string 2",
                    action: "APPLICATION_UPDATE",
                    status: "unread",
                    sendAt: "2012-12-12",
                    readAt: "2012-12-12",
                },
                {
                    notificationId: "string 3",
                    userId: "string 3",
                    taskId: "string 3",
                    title: "Title 3",
                    body: "string 3",
                    category: "default",
                    key: "string 3",
                    action: "APPROVAL_SURVEYOR",
                    status: "read",
                    sendAt: "2012-12-12",
                    readAt: "2012-12-12",
                },
            ],
            meta: { count: 2 },
        },
    });
};

const readAllNotification = () => {
    return axios.post.mockResolvedValueOnce({
        data: { data: true },
    });
};

const readNotification = () => {
    return axios.post.mockResolvedValueOnce({
        data: { data: true },
    });
};

describe("Notification page", () => {
    test("Test snapshot", async () => {
        getNotification();
        axios.get.mockResolvedValueOnce({});
        getNotification();

        const view = await renderPage();
        view.asFragment();
    });

    test("Notification error 404 get data", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockRejectedValueOnce({ response: { data: { code: 404 } } });

        renderPage();

        await waitFor(() => screen.findAllByText("Notifikasi kosong ..."));
    });

    test("Notification error other get data", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockRejectedValueOnce({ response: { data: { code: 0 } } });

        renderPage();

        await waitFor(() => screen.findAllByText("Terjadi kesalahan :("));

        const refreshButton = await screen.findByText("Refresh");
        fireEvent.click(refreshButton);
    });

    test("Notification success get data read all notifications", async () => {
        axios.get.mockResolvedValueOnce({});
        getNotification();

        renderPage();

        await waitFor(() => screen.findAllByText("Title 1"));

        axios.get.mockRejectedValueOnce({});
        getNotification();
        const readAllNotificationButton = screen.getByText("Tandai Sudah Dibaca");
        fireEvent.click(readAllNotificationButton);

        readAllNotification();
        getNotification();
        fireEvent.click(readAllNotificationButton);
    });

    test("Notification success get data", async () => {
        axios.get.mockResolvedValueOnce({});
        getNotification();

        renderPage();

        await waitFor(() => screen.findAllByText("Title 1"));

        readNotification();
        const readNotification1 = await screen.findAllByText("Title 1");
        fireEvent.click(readNotification1[0]);

        readNotification();
        const readNotification2 = await screen.findAllByText("Title 2");
        fireEvent.click(readNotification2[0]);

        const readNotification3 = await screen.findAllByText("Title 3");
        fireEvent.click(readNotification3[0]);
    });
});

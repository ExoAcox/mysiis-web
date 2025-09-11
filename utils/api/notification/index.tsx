import { axios, catchHelper, header } from "@libs/axios";

interface GetNotification {
    row: number;
    page: number;
}

export interface Notification {
    notificationId: string;
    userId: string;
    taskId: string;
    title: string;
    body: string;
    category: string;
    key: string;
    action: string;
    status: "unread" | "read";
    sendAt: Date;
    readAt: Date;
}

export const getNotification = (params: GetNotification): Promise<{ lists: Notification[]; totalCount: number }> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_NOTIFICATION_URL + `/notifications/v1`, { params, headers: header() })
            .then((response) => {
                resolve({ lists: response.data.data, totalCount: response.data.meta.count });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const readNotification = (notificationId: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_NOTIFICATION_URL + `/notifications/v1/${notificationId}/read`, {}, { headers: header() })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const readAllNotification = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_NOTIFICATION_URL + `/notifications/v1/read`, {}, { headers: header() })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

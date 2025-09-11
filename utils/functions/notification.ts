import { collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "@libs/firebase";
import { useNotificationStore } from "@libs/store";

import { Notification, getNotification } from "@api/notification";

import { errorHelper } from "./common";

export const fetchNotification = async (userId: string) => {
    useNotificationStore.setState({ data: [], status: "pending", error: null });

    try {
        const response = await getNotification({ page: 1, row: 10 });
        useNotificationStore.setState({ data: response.lists, status: "resolve" });
        const q = query(collection(db, "notifications", userId, "notificationItems"), orderBy("sendAt", "desc"), limit(1));
        onSnapshot(doc(db, "notifications", userId), (doc) => {
            useNotificationStore.setState({ unreadCount: doc.data()?.unread_count || 0 });
        });
        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                const data = change.doc.data() as Notification;
                if (change.type === "added" && useNotificationStore.getState().data[0].notificationId !== data.notificationId) {
                    useNotificationStore.setState({ data: [data, ...useNotificationStore.getState().data] });
                }
            });
        });
    } catch (error) {
        useNotificationStore.setState({ data: [], status: "reject", error: errorHelper(error) });
    }
};

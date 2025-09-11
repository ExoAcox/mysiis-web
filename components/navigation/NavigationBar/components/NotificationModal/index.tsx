import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title, Subtitle } from "@components/text";

import { MdClose } from "react-icons/md";
import { useEffect } from "react";

import { useNotificationStore } from "@libs/store";

import { Notification, readNotification } from "@api/notification";

const NotificationModal = () => {
    const { modal, setModal, data } = useModal<Notification>("notification");
    const notificationStore = useNotificationStore();

    useEffect(() => {
        if (data.notificationId && data.status === "unread") {
            handleReadNotification(data.notificationId);
        }
    }, [data]);

    const handleReadNotification = async (notificationId: string) => {
        try {
            const notificationIndex = notificationStore.data.findIndex((notification: { notificationId: string; }) => notification.notificationId === notificationId);
            if (notificationIndex >= 0) {
                const newData = [...notificationStore.data];
                newData.splice(notificationIndex, 1, { ...newData[notificationIndex], status: "read" });
                notificationStore.set({ data: newData, status: "resolve" });
            }

            readNotification(notificationId);
        } catch { }
    };

    return (
        <Modal visible={modal} className="p-2 rounded-lg notification">
            <MdClose onClick={() => setModal(false)} className="w-5 h-5 ml-auto cursor-pointer hover:fill-primary-40" />
            <div className="p-8 pt-6">
                <Title>{data.title}</Title>
                <Subtitle>{data.body}</Subtitle>
            </div>
        </Modal>
    );
};

export default NotificationModal;

import dayjs from "dayjs";
import { useRouter } from "next/router";

import { useNotificationStore } from "@libs/store";

import { Notification, readNotification } from "@api/notification";

import { tw } from "@functions/style";

import { actionList } from "@data/notification";

import IconCheck from "@images/vector/notification_check.svg";
import IconPhone from "@images/vector/notification_phone.svg";
import IconStar from "@images/vector/notification_star.svg";

interface Props {
    notification: Notification;
    notifications: Notification[];
    setNotifications: (data: Notification[]) => void;
}

const NotificationCard: React.FC<Props> = ({ notification, notifications, setNotifications }) => {
    const router = useRouter();

    const icon = () => {
        const className = "w-6 h-6 shrink-0";
        switch (notification.category) {
            case "info":
                return <IconPhone className={className} />;
            case "point":
                return <IconStar className={className} />;
            default:
                return <IconCheck className={className} />;
        }
    };

    const clickHandler = () => {
        const actionData = actionList.find((action) => action.key.includes(notification.action));
        if (notification.status === "unread") handleReadNotification(notification.notificationId);
        if (actionData?.href) router.push(actionData.href);
    };

    const notificationStore = useNotificationStore();

    const handleReadNotification = async (notificationId: string) => {
        try {
            const notificationIndex = notificationStore.data.findIndex((notification) => notification.notificationId === notificationId);
            if (notificationIndex >= 0) {
                const newData = [...notificationStore.data];
                newData.splice(notificationIndex, 1, { ...newData[notificationIndex], status: "read" });
                notificationStore.set({ data: newData, status: "resolve" });
            }

            const notificationIndex2 = notifications.findIndex((notification) => notification.notificationId === notificationId);
            if (notificationIndex2 >= 0) {
                const newData = [...notifications];
                newData.splice(notificationIndex2, 1, { ...newData[notificationIndex2], status: "read" });
                setNotifications(newData);
            }

            readNotification(notificationId);
        } catch {}
    };

    return (
        <div className={tw("flex gap-4 p-4 sm:px-0 cursor-pointer", notification.status === "unread" && "bg-primary-10")} onClick={clickHandler}>
            {icon()}
            <div className="flex flex-col gap-2">
                <label className="font-bold text-black-90 text-medium line-clamp-1">{notification.title}</label>
                <span className="text-black-70 text-medium line-clamp-1">{notification.body}</span>
                <span className="text-black-70 text-small">{dayjs(notification.sendAt).format("DD MMM YYYY HH:mm")}</span>
            </div>
        </div>
    );
};

export default NotificationCard;

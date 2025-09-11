import { IoTriangle } from "react-icons/io5";
import { Case, Default, Switch, When } from "react-if";

import { useNotificationStore } from "@libs/store";

import { fetchNotification } from "@functions/notification";

import { NotificationCard } from "@features/notification/components";

import { Spinner } from "@components/loader";
import { Link } from "@components/navigation";
import { Notification } from "@api/notification";

const Notifications: React.FC<{ userId: string }> = ({ userId }) => {
    const notificationStore = useNotificationStore();

    return (
        <div className="sm:hidden absolute bg-white  rounded-lg shadow-lg pb-2.5 w-[23.75rem] -translate-x-1/2 top-[2.75rem] overflow-show">
            <IoTriangle className="absolute top-0 -translate-y-[.875rem] left-1/2 fill-white" />
            <div className="max-h-[35rem] overflow-auto rounded-lg">
                <div className="px-3.5 flex justify-between items-center sticky top-0 bg-white pt-2.5 pb-2.5 font-bold">
                    <label className="text-black-100">Notifikasi</label>
                    <Link href="/notification" className="text-medium text-primary-40">
                        Lihat Semua
                    </Link>
                </div>
                <When condition={notificationStore.status === "pending"}>
                    <Spinner className="py-4" />
                </When>
                <When condition={notificationStore.status === "reject"}>
                    <div className="flex flex-col items-center justify-center gap-2 pt-6 pb-8 font-bold">
                        <Switch>
                            <Case condition={notificationStore.error?.code === 404}>Notifikasi kosong :)</Case>
                            <Default>
                                <span>Terjadi kesalahan :(</span>
                                <span
                                    className="cursor-pointer text-primary-40"
                                    onClick={() => {
                                        fetchNotification(userId);
                                    }}
                                >
                                    Refresh
                                </span>
                            </Default>
                        </Switch>
                    </div>
                </When>
                <When condition={notificationStore.status === "resolve"}>
                    <div>
                        {notificationStore.data
                            .filter((_: unknown, index: number) => index < 10)
                            .map((notification: Notification) => {
                                return (
                                    <NotificationCard
                                        notification={notification}
                                        key={notification.notificationId}
                                        notifications={notificationStore.data}
                                        setNotifications={notificationStore.set}
                                    />
                                );
                            })}
                    </div>
                </When>
            </div>
        </div>
    );
};

export default Notifications;

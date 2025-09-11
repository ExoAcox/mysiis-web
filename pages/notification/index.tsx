import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { session, getServer } from "@libs/session";

import { When, Switch, Default, Case } from "react-if";
import { toast } from "react-toastify";

import { getNotification, readAllNotification, Notification } from "@api/notification";

import { Wrapper, Responsive } from "@components/layout";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Spinner } from "@components/loader";

import { NotificationCard } from "@features/notification/components";
import { errorHelper } from "@functions/common";

const Notifications: React.FC<{ user: User }> = ({ user }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [status, setStatus] = useState("pending");
    const [error, setError] = useState<DataError | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);

    const getData = async (page: number) => {
        setNotifications([]);
        setStatus("pending");
        setError(null);

        try {
            const response = await getNotification({ page, row: 10 });
            setNotifications(response.lists);
            setTotalCount(response.totalCount);
            setStatus("resolve");
        } catch (error) {
            setStatus("reject");
            setError(errorHelper(error));
        }
    };

    const readAllData = async () => {
        try {
            await readAllNotification();
            toast("Sukses membaca seluruh notifikasi");
            setPage(1);
            getData(1);
        } catch (error) {
            toast.error((error as DataError)?.message);
        }
    };

    useEffect(() => {
        getData(page);
    }, [page]);

    return (
        <Wrapper user={user} title="Notifikasi">
            <Responsive className="py-[3.125rem] sm:py-4">
                <div className="flex items-center justify-between px-4 pb-4 font-bold sm:px-0 sm:pb-3 sm:text-medium">
                    <label className="text-black-100">Semua Notifikasi</label>
                    <label className="cursor-pointer text-primary-40" onClick={readAllData}>
                        Tandai Sudah Dibaca
                    </label>
                </div>
                <When condition={status === "pending"}>
                    <Spinner size={100} className="pt-16 pb-8" />
                </When>
                <When condition={status === "reject"}>
                    <div className="flex flex-col items-center justify-center gap-2 py-8 font-bold">
                        <Switch>
                            <Case condition={error?.code === 404}>Notifikasi kosong ...</Case>
                            <Default>
                                <span>Terjadi kesalahan :(</span>
                                <span
                                    className="cursor-pointer text-primary-40"
                                    onClick={() => {
                                        setPage(1);
                                        getData(1);
                                    }}
                                >
                                    Refresh
                                </span>
                            </Default>
                        </Switch>
                    </div>
                </When>
                <When condition={status === "resolve"}>
                    <div>
                        {notifications.map((notification) => {
                            return (
                                <NotificationCard
                                    notification={notification}
                                    key={notification.notificationId}
                                    notifications={notifications}
                                    setNotifications={setNotifications}
                                />
                            );
                        })}
                    </div>
                </When>
                <div className="flex items-center justify-between mx-4 mt-7 sm:mx-0">
                    <PaginationInfo page={page} row={10} totalCount={totalCount} label="Notifikasi" />
                    <Pagination page={page} row={10} totalCount={totalCount} onChange={(page) => setPage(page)} />
                </div>
            </Responsive>

        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({ context, guest: true });

    return server;
});

export default Notifications;

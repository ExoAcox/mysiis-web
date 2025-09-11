import { useCallback } from "react";
import { MdClose } from "react-icons/md";

import { User } from "@api/account/user";

import useModal from "@hooks/useModal";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { fetchListUser } from "@features/support/supervisor-menu/queries/user";
import { useFilterStore, useUserStore } from "@features/support/supervisor-menu/store";

import { Button } from "@components/button";
import { Image } from "@components/layout";
import { Table } from "@components/table";

const MainTable = () => {
    const userStore = useUserStore();
    const filterStore = useFilterStore();
    const { tab, page, row } = filterStore;

    const { setData } = useModal("supervisor-detail");
    const approveModal = useModal("account-approve");
    const rejectModal = useModal("account-reject");
    const blockModal = useModal("account-block");
    const unblockModal = useModal("account-unblock");

    const actionButton = useCallback(
        (data: User) => {
            const className = "h-6 mt-1 text-xs w-18";

            switch (tab) {
                case "verified":
                    return (
                        <Button
                            className={className}
                            onClick={() => {
                                blockModal.setData(data);
                            }}
                        >
                            Blokir
                        </Button>
                    );
                case "pending":
                    return (
                        <div className="flex gap-2">
                            <Button
                                className={className}
                                onClick={() => {
                                    approveModal.setData(data);
                                }}
                            >
                                Terima
                            </Button>
                            {}
                            <Button
                                className={className}
                                variant="ghost"
                                onClick={() => {
                                    rejectModal.setData(data);
                                }}
                            >
                                Tolak
                            </Button>
                        </div>
                    );
                case "block":
                    return (
                        <Button
                            className={className}
                            onClick={() => {
                                unblockModal.setData(data);
                            }}
                        >
                            Terima
                        </Button>
                    );
            }
        },
        [tab]
    );

    const onPageChange = (page: number) => {
        filterStore.set({ page });
        fetchListUser({ ...filterStore, page }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    return (
        <>
            <div className="w-full">
                <Table
                    rows={userStore.data}
                    columns={[
                        { header: "No", value: (_, index) => page * row - row + index + 1 },
                        { header: "Nama", value: (data) => data.fullname || "-" },
                        { header: "Email", value: (data) => data.email || "-" },
                        { header: "Telepon", value: (data) => data.mobile || "-" },
                        { header: "Regional", value: (data) => data.customdata?.regional || "-", className: "whitespace-nowrap" },
                        { header: "Witel", value: (data) => data.customdata?.witel || "-" },
                        {
                            header: "Foto",
                            value: (data) =>
                                data.fotoWajah ? <Image src={data.fotoWajah} width={30} height={50} /> : <MdClose className="w-5 h-5" />,
                        },
                        {
                            header: "Aksi",
                            onClick: (data) => setData(data),
                            value: () => "Ubah",
                            className: "text-primary-40 font-bold cursor-pointer",
                        },
                    ]}
                    loading={userStore.status === "pending"}
                />
            </div>
            <Pagination totalCount={userStore.totalData} page={page} onPageChange={onPageChange} onRowChange={onRowChange} row={row} />
        </>
    );
};

export default MainTable;

import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Case, Switch } from "react-if";

import { getServer, session } from "@libs/session";

import { TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { DetailModal, FilterBar, MainTable } from "@features/support/supervisor-menu/components";
import { getRole } from "@features/support/supervisor-menu/functions/user";
import { fetchListUser } from "@features/support/supervisor-menu/queries/user";
import { Tab, useFilterStore } from "@features/support/supervisor-menu/store";

import { Responsive, Wrapper } from "@components/layout";
import { Title } from "@components/text";

interface ModalProps {
    refresh: () => void;
}

const ApproveModal = dynamic<ModalProps>(() => import("@features/support/supervisor-menu/components").then((mod) => mod.ApproveModal));
const RejectModal = dynamic<ModalProps>(() => import("@features/support/supervisor-menu/components").then((mod) => mod.RejectModal));
const BlockModal = dynamic<ModalProps>(() => import("@features/support/supervisor-menu/components").then((mod) => mod.BlockModal));
const UnblockModal = dynamic<ModalProps>(() => import("@features/support/supervisor-menu/components").then((mod) => mod.UnblockModal));

const SupervisorMenu: React.FC<{ user: User }> = ({ user }) => {
    const filterStore = useFilterStore();
    const { regional, witel, role, tab, row } = filterStore;

    const getData = (init?: string) => {
        if (init) filterStore.set({ page: 1 });
        fetchListUser({ ...filterStore, page: init ? 1 : filterStore.page });
    };

    useEffect(() => {
        filterStore.set({
            regional: user.regional && user.regional !== "National" ? user.regional : "",
            witel: user.witel && user.witel !== "All" ? user.witel : "",
            role: getRole(user.role_keys),
        });
    }, []);

    useEffect(() => {
        getData("init");
    }, [regional, witel, role, row]);

    return (
        <Wrapper
            user={user}
            title="Supervisor Menu"
            tab={{
                value: tab,
                options: [
                    { label: "Member", value: "verified" },
                    { label: "Tertunda", value: "pending" },
                    { label: "Diblokir", value: "block" },
                    { label: "Ditolak", value: "reject" },
                ],
                onChange: (value) => {
                    const tab = value as Tab;

                    filterStore.set({ tab, page: 1, search: "" });
                    fetchListUser({ ...filterStore, tab, page: 1 });
                },
            }}
        >
            <Responsive className="pt-0">
                <TitleBar>
                    <Switch>
                        <Case condition={tab === "verified"}>Daftar Pengguna yang sudah diverifikasi oleh Supervisor</Case>
                        <Case condition={tab === "pending"}>Daftar Pengguna yang masih tertunda/belum diverifikasi oleh Supervisor</Case>
                        <Case condition={tab === "block"}>Daftar Pengguna yang diblokir oleh Supervisor</Case>
                        <Case condition={tab === "reject"}>Daftar Pengguna yang ditolak oleh Supervisor</Case>
                    </Switch>
                </TitleBar>
                <div className="p-6 mb-16 bg-white rounded-md shadow">
                    <Title>Daftar Pengguna</Title>
                    <FilterBar user={user} />
                    <MainTable />
                </div>
            </Responsive>

            <DetailModal tab={tab} />
            <ApproveModal refresh={getData} />
            <RejectModal refresh={getData} />
            <BlockModal refresh={getData} />
            <UnblockModal refresh={getData} />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["supervisor"],
    });

    return server;
});

export default SupervisorMenu;

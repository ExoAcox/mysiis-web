import useModal from "@hooks/useModal";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { fetchSurveyorAssignment } from "@features/planning/dashboard-microdemand/queries/assignment/surveyor";
import { useFilterStore, useSurveyorStore } from "@features/planning/dashboard-microdemand/store/assignment";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { Table } from "@components/table";

const SurveyorTable: React.FC<{ user: User }> = ({ user }) => {
    const surveyorStore = useSurveyorStore();
    const filterStore = useFilterStore();
    const activateModal = useModal("assignment-surveyor-activate");
    const { page, row, userid, mysistaid } = filterStore;

    const onPageChange = (page: number) => {
        filterStore.set({ page });
        fetchSurveyorAssignment({ page, row, supervisorid: user.userId, userid, mysistaid }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    return (
        <>
            <div className="w-full">
                <Table
                    rows={surveyorStore.data}
                    columns={[
                        { header: "No", value: (_, index) => filterStore.page * row - row + index + 1 },
                        { header: "Nama Surveyor", value: (data) => data.detail.account.fullname || "-" },
                        { header: "Nama Polygon", value: (data) => data.detail.mysista.name || "-" },
                        { header: "Alamat", value: (data) => data.detail.mysista.address || "-" },
                        { header: "Kelurahan", value: (data) => data.detail.mysista.desa || "-" },
                        { header: "Kecamatan", value: (data) => data.detail.mysista.kecamatan || "-" },
                        { header: "Kota", value: (data) => data.detail.mysista.kabupaten || "-" },
                        { header: "Target", value: (data) => data.detail.mysista.target_household || "-" },
                        {
                            header: "Status",
                            value: (data) => {
                                return <BadgeStatus status={data.status} />;
                            },
                        },
                        {
                            header: "Aksi",
                            value: (data) => {
                                return (
                                    <Button
                                        className="h-6 px-1.5 text-xs w-full"
                                        onClick={() => {
                                            activateModal.setData(data);
                                        }}
                                    >
                                        {data.status === "inactive" ? "Aktifkan" : "Non-aktifkan"}
                                    </Button>
                                );
                            },
                        },
                    ]}
                    loading={surveyorStore.status === "pending"}
                />
            </div>
            <Pagination totalCount={surveyorStore.totalData} page={page} onPageChange={onPageChange} row={row} onRowChange={onRowChange} />
        </>
    );
};

export default SurveyorTable;

const BadgeStatus: React.FC<{ status: string }> = ({ status }) => {
    const variant = () => {
        switch (status) {
            case "permit-active":
                return "success";
            case "active":
                return "success";
            case "inactive":
                return "error";
            default:
                return "default";
        }
    };

    return <Badge variant={variant()}>{status}</Badge>;
};

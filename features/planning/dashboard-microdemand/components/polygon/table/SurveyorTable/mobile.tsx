import useModal from "@hooks/useModal";

import { BadgeStatus, Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { usePolygonTselStore, useFilterStore } from "@features/planning/dashboard-microdemand/store/polygon";
import { fetchPolygonTsel } from "@features/planning/dashboard-microdemand/queries/global/polygon";

import { Button } from "@components/button";
import { TableMobile } from "@components/table";

const SurveyorTable: React.FC<{ user: User }> = ({ user }) => {
    const polygonStore = usePolygonTselStore();
    const filterStore = useFilterStore();
    const polygonApprovalModal = useModal("polygon-approval");
    const { page, row, status, area, regional, witel } = filterStore;

    const onPageChange = (value: number) => {
        filterStore.set({ page: value });

        // fetchPolygonTsel({ page: value, row, area: user.role_keys.includes("admin-survey-nasional") ? "ALL" : area, treg: regional, witel, status });
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    return (
        <>
            <div className="w-full">
                <TableMobile
                    headerClassName="w-[7rem]"
                    rows={polygonStore.data}
                    columns={[
                        { header: "No", value: (_, index) => filterStore.page * row - row + index + 1 },
                        { header: "Nama Polygon", value: (data) => data.name || "-" },
                        { header: "Region", value: (data) => data.treg || "-" },
                        { header: "Branch", value: (data) => data.witel || "-" },
                        { header: "Surveyor", value: (data) => data.surveyor || "-" },
                        { header: "Target Houshold", value: (data) => data.target_household || "-" },
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
                                        variant="nude"
                                        className="h-6 px-1.5 text-xs w-full"
                                        onClick={() => {
                                            polygonApprovalModal.setData(data);
                                        }}
                                    >
                                        Lihat
                                    </Button>
                                );
                            },
                        },
                    ]}
                    loading={polygonStore.status === "pending"}
                />
            </div>
            <Pagination totalCount={polygonStore.totalData} page={page} onPageChange={onPageChange} row={row} onRowChange={onRowChange} />
        </>
    );
};

export default SurveyorTable;

import useModal from "@hooks/useModal";

import { BadgeStatus, Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { useFilterStore, usePolygonTselStore } from "@features/planning/dashboard-microdemand/store/polygon";
import { fetchPolygonTsel } from "@features/planning/dashboard-microdemand/queries/global/polygon";

import { Button } from "@components/button";
import { Table } from "@components/table";

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
                <Table
                    // rows={dataDumy}
                    rows={polygonStore.data}
                    columns={[
                        { header: "No", value: (_, index) => filterStore.page * row - row + index + 1 },
                        { header: "Nama Polygon", value: (data) => data.name || "-" },
                        { header: "Region", value: (data) => data.treg || "-" },
                        { header: "Branch", value: (data) => data.witel || "-" },
                        { header: "Surveyor", value: (data) => data.surveyor || "-" },
                        { header: "Target Household", value: (data) => data.target_household || "-" },
                        { header: "Valid Mitra", value: (data) => data.summary?.["valid-mitra"]},
                        { header: "Valid", value: (data) => data.summary?.valid},
                        { header: "Invalid", value: (data) => data.summary?.invalid},
                        { header: "Total", value: (data) => data.summary?.total_survey},
                        { header: "BAK Pending", value: (data) => {
                            if(data.attachment_pending) {
                                return <a href={data.attachment_pending} target="_blank" className="underline text-blue-500">Lihat</a>;
                            } else {
                                return "-";
                            }
                        }},
                        { header: "BAK Drop", value: (data) => {
                            if(data.attachment_drop) {
                                return <a href={data.attachment_drop} target="_blank" className="underline text-blue-500">Lihat</a>;
                            } else {
                                return "-";
                            }
                        }},
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

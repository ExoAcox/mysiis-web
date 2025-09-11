import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { Table } from "@components/table";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { useSupervisorStore, useFilterStore } from "@features/planning/dashboard-microdemand/store/supervisor";

const ListTableSupervisor: React.FC<{ device?: Device }> = () => {
    const supervisorStore = useSupervisorStore();
    const filterStore = useFilterStore();
    const { page, row } = filterStore;

    const onPageChange = (page: number) => {
        filterStore.set({ page });
        // fetchSurveyorAssignment({ page, row, supervisorid: user.userId, userid, mysistaid }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    return (
        <>
            <div className="w-full">
                <Table
                    rows={supervisorStore.data}
                    columns={[
                        { header: "No", value: (_, index) => filterStore.page * row - row + index + 1 },
                        { header: "Nama", value: (data) => data.name || "-" },
                        { header: "Vendor", value: (data) => data.mysista_source || "-" },
                        { header: "Region", value: (data) => data.mysista_treg || "-" },
                        { header: "Branch", value: (data) => data.mysista_witel.map(item => item).join(",") || "-" },
                        { header: "Regional", value: (data) => data.telkom_treg || "-" },
                        { header: "Witel", value: (data) => data.telkom_witel.map(item => item).join(",") || "-" },
                        {
                            header: "Aksi",
                            value: (data) => {
                                return (
                                    <Button
                                        className="h-6 px-1.5 text-xs w-full"
                                        onClick={() => {}}
                                    >
                                        Edit
                                    </Button>
                                );
                            },
                        },
                    ]}
                    // loading={supervisorStore.status === "pending"}
                />
            </div>
            <Pagination totalCount={supervisorStore.totalData} page={page} onPageChange={onPageChange} row={row} onRowChange={onRowChange} />
        </>
    );
};

export default ListTableSupervisor;

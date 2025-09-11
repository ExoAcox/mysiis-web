import useModal from "@hooks/useModal";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { fetchSurveyorAssignment } from "@features/planning/dashboard-microdemand/queries/assignment/surveyor";
import { useFilterStore, useSurveyorStore } from "@features/planning/dashboard-microdemand/store/assignment";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { TableMobile } from "@components/table";

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
                <TableMobile
                    headerClassName="w-[7rem]"
                    rows={surveyorStore.data}
                    columns={[
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
                                return data.is_active === "Y" ? <Badge variant="success">AKTIF</Badge> : <Badge variant="error">TIDAK AKTIF</Badge>;
                            },
                        },
                        {
                            value: (data) => {
                                return (
                                    <Button
                                        className="h-6 px-1.5 text-xs w-full"
                                        onClick={() => {
                                            activateModal.setData(data);
                                        }}
                                    >
                                        {data.is_active === "Y" ? "Non-aktifkan" : "Aktifkan"}
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

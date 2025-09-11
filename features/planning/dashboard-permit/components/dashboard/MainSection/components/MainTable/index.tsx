import useModal from "@hooks/useModal";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { getModalId, tableDataDefaultPerzinan } from "@features/planning/dashboard-microdemand/functions/dashboard";
import { fetchSurveyPermits } from "@features/planning/dashboard-permit/queries/dashboard/survey";
import { useSurveyStore, useFilterStore } from "@features/planning/dashboard-permit/store/dashboard";

import { Table } from "@components/table";

const MainTable: React.FC = () => {
    const surveyStore = useSurveyStore();
    const filterStore = useFilterStore();
    const { page, row } = filterStore;

    const { setData } = useModal(getModalId("dashboard-survey-default"));

    const onPageChange = (page: number) => {
        filterStore.set({ page });
        fetchSurveyPermits({ ...filterStore, page }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    const getTableData = () => {
        return tableDataDefaultPerzinan({ row, page, setData });
    };

    return (
        <div>
            <Table className="" bodyClassName="max-w-[170px]" loading={surveyStore.status === "pending"} rows={surveyStore.data} columns={getTableData()} />
            <Pagination row={row} totalCount={surveyStore.totalData} page={page} onPageChange={onPageChange} onRowChange={onRowChange} />
        </div>
    );
};

export default MainTable;

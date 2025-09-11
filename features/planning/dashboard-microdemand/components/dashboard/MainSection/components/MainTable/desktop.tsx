import useModal from "@hooks/useModal";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { getModalId, tableDataDefault } from "@features/planning/dashboard-microdemand/functions/dashboard";
import { fetchSurvey } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";
import { useFilterStore, useSurveyStore } from "@features/planning/dashboard-microdemand/store/dashboard";

import { Table } from "@components/table";

const MainTable: React.FC = () => {
    const surveyStore = useSurveyStore();
    const filterStore = useFilterStore();
    const { page, row, category } = filterStore;

    const { setData } = useModal(getModalId(category));

    const onPageChange = (page: number) => {
        filterStore.set({ page });
        fetchSurvey({ ...filterStore, page }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    const getTableData = () => {
        return tableDataDefault({ row, page, setData });
    };

    return (
        <div>
            <Table className="" bodyClassName="max-w-[170px]" loading={surveyStore.status === "pending"} rows={surveyStore.data} columns={getTableData()} />
            <Pagination row={row} totalCount={surveyStore.totalData} page={page} onPageChange={onPageChange} onRowChange={onRowChange} />
        </div>
    );
};

export default MainTable;

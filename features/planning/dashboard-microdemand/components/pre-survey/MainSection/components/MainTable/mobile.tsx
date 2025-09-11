import useModal from "@hooks/useModal";

import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import {
    getModalId,
    tableDataMobileDefault,
} from "@features/planning/dashboard-microdemand/functions/dashboard";
import { fetchSurveyPermits } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";
import { useFilterStore, useSurveyStore } from "@features/planning/dashboard-microdemand/store/dashboard";

import { TableMobile } from "@components/table";

const MainTable: React.FC = () => {
    const surveyStore = useSurveyStore();
    const filterStore = useFilterStore();
    const { page, row, category } = filterStore;

    const { setData } = useModal(getModalId(category));

    const onPageChange = (page: number) => {
        filterStore.set({ page });
        fetchSurveyPermits({ ...filterStore, page }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filterStore.set({ row });
    };

    const getTableData = () => {
        return tableDataMobileDefault({ setData });
    };

    return (
        <div>
            <TableMobile loading={surveyStore.status === "pending"} rows={surveyStore.data} columns={getTableData()} />

            <Pagination row={row} totalCount={surveyStore.totalData} page={page} onPageChange={onPageChange} onRowChange={onRowChange} />
        </div>
    );
};

export default MainTable;

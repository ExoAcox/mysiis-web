import dayjs from "dayjs";

import { Pooling } from "@api/rpa/pooling";

import useModal from "@hooks/useModal";

import { getStatus } from "@features/support/rpa-pooling/functions/common";

import { Badge } from "@components/badge";
import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";

interface Props {
    data: {
        lists: Pooling[];
        totalData: number;
    };
    loading: boolean;
    error: FetchError;
    page: number;
    setPage: (value: number) => void;
}

const Main: React.FC<Props> = ({ data, loading, error, page, setPage }) => {
    const { setData } = useModal("rpa-pooling-download");

    return (
        <div>
            <Table
                rows={data.lists}
                columns={[
                    { header: "File Name", value: (pooling) => pooling.filename },
                    { header: "Task Count", value: (pooling) => pooling.task_count },
                    { header: "Finish Count", value: (pooling) => pooling.finish_count },
                    { header: "Fail Count", value: (pooling) => pooling.fail_count },
                    { header: "Created At", value: (pooling) => (pooling.created_at ? dayjs(pooling.created_at).format("YYYY-MM-DD, HH:mm") : "-") },
                    { header: "Running At", value: (pooling) => (pooling.running_at ? dayjs(pooling.running_at).format("YYYY-MM-DD, HH:mm") : "-") },
                    {
                        header: "Finished At",
                        value: (pooling) => (pooling.finished_at ? dayjs(pooling.finished_at).format("YYYY-MM-DD, HH:mm") : "-"),
                    },
                    {
                        header: "Status",
                        value: (pooling) => <Badge variant={getStatus(pooling.status)}>{pooling.status}</Badge>,
                        className: "font-bold",
                    },
                    {
                        header: "Download",
                        value: (pooling) => (
                            <Button className="py-1.5 px-2 text-small" onClick={() => setData(pooling)}>
                                Download
                            </Button>
                        ),
                    },
                ]}
                loading={loading}
                error={error}
            />
            <div className="flex items-center gap-3 mt-6">
                <Dropdown
                    id="dropdown-pagination"
                    options={new Array(Math.ceil(data.totalData / 10)).fill(0).map((_, index) => index + 1) as unknown as Option<number>[]}
                    value={page}
                    onChange={(page) => setPage(page)}
                    position="top center"
                />
                <PaginationInfo row={10} page={page} totalCount={data.totalData} />
                <Pagination className="ml-auto" row={10} page={page} totalCount={data.totalData} onChange={(page) => setPage(page)} />
            </div>
        </div>
    );
};

export default Main;

import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useState } from "react";

import { getServer, session } from "@libs/session";

import { DownloadModal, Header, Main, UploadModal } from "@features/support/rpa-pooling/components";
import { usePooling } from "@features/support/rpa-pooling/store";

import { Responsive, Wrapper } from "@components/layout";

export interface Filter {
    page: number;
    status?: string;
    filename?: string;
    created_at_start: string;
    created_at_end: string;
}

const RpaPooling: React.FC<{ user: User }> = ({ user }) => {
    const [filter, setFilter] = useState<Filter>({
        page: 1,
        created_at_start: dayjs().subtract(1, "months").format("YYYY-MM-DD"),
        created_at_end: dayjs().format("YYYY-MM-DD"),
    });

    const { data, error, refresh, isPending } = usePooling(filter);

    return (
        <Wrapper title="RPA Pooling" user={user}>
            <Responsive className="my-8 bg-white rounded-lg shadow py-9">
                <Header refresh={refresh} filter={filter} setFilter={setFilter} />
                <Main data={data} loading={isPending} error={error} page={filter.page} setPage={(page) => setFilter({ ...filter, page })} />
            </Responsive>
            <DownloadModal />
            <UploadModal refresh={refresh} />
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["obc", "roc"],
    });

    return server;
});

export default RpaPooling;

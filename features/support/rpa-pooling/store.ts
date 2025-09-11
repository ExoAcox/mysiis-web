import { useQuery } from "@tanstack/react-query";

import queryClient from "@libs/react-query";

import { getPooling } from "@api/rpa/pooling";

import { Filter } from "@pages/support/rpa-pooling";

export const usePooling = (filter: Filter) => {
    const query = useQuery({
        queryKey: ["/rpa-pooling/pooling", filter],
        queryFn: () => {
            const filename = filter.filename || undefined;
            const status = filter.status ? [filter.status] : undefined;
            return getPooling({ ...filter, filename, status, row: 10 });
        },
    });

    return {
        ...query,
        data: query.data ?? { lists: [], totalData: 0 },
        refresh: () => {
            queryClient.removeQueries({ queryKey: ["/rpa-pooling/pooling", filter] });
            query.refetch();
        },
    };
};

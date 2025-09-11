import { useQuery } from "@tanstack/react-query";

import queryClient from "@libs/react-query";

import { Mask, getMask } from "@api/rpa-wibs";

export const useMasking = () => {
    const query = useQuery({
        queryKey: ["getMask"],
        queryFn: () => getMask(),
    });

    return {
        ...query,
        update: (data: Mask[]) => queryClient.setQueryData(["getMask"], () => data),
    };
};

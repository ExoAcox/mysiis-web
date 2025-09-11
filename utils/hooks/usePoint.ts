import { useQuery } from "@tanstack/react-query";

import { getWallet } from "@api/point";

const usePoint = (userId: string) =>
    useQuery({
        queryKey: ["point/getWallet", userId],
        queryFn: () => getWallet(userId),
        enabled: !!userId,
    });

export default usePoint;

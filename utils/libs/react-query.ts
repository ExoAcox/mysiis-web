import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                if ((error as DataError)?.code === 404) return false;
                if (failureCount > 0) return true;
                return false;
            },
        },
    },
});

export default queryClient;

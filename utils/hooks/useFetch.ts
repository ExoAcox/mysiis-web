import { useState } from "react";

interface OptionModel<Data, FinalData> {
    format?: (data: Data) => FinalData;
    onResolve?: (data: Data) => void;
    onReject?: (error: DataError) => void;
    onFinally?: () => void;
}

function useFetch<Response, Initial = Response>(initialData: Initial) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState<DataError | null>(null);
    const [status, setStatus] = useState<DataStatus>("idle");

    const reset = () => {
        setData(initialData);
        setError(null);
        setStatus("idle");
    };

    const fetch = (getData: Promise<Response>, option: OptionModel<Response, Initial> = {}) => {
        setStatus("pending");
        setData(initialData);
        setError(null);

        getData
            .then((resolve) => {
                setData(option.format ? option.format(resolve) : (resolve as unknown as Initial));
                setStatus("resolve");

                if (option.onResolve) option.onResolve(resolve);
            })
            .catch((reject) => {
                const error = typeof reject === "object" ? reject : { message: reject, code: 500 };
                setError(error);
                setStatus("reject");

                if (option.onReject) option.onReject(reject);
            })
            .finally(() => {
                if (option.onFinally) option.onFinally();
            });
    };

    return { data, setData, status, setStatus, error, setError, fetch, reset };
}

export default useFetch;

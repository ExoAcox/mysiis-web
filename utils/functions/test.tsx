import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import axios from "axios";
import { JSXElementConstructor, ReactElement } from "react";
import { Mock } from "vitest";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const customRender = (ui: ReactElement<any, string | JSXElementConstructor<any>>, options = {}) =>
    render(ui, {
        wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
                <div id="__root">
                    {children}
                    <div id="__modal" />
                </div>
            </QueryClientProvider>
        ),
        ...options,
    });

export * from "@testing-library/react";

export { default as userEvent } from "@testing-library/user-event";

export { customRender as render };

interface Axios {
    get: Mock;
    post: Mock;
    put: Mock;
    patch: Mock;
    delete: Mock;
}

const mockedAxios = axios as unknown as Axios;

export { mockedAxios as axios };

const fetchResolve = async (method: "get" | "post" | "delete" | "put", func: (_: unknown) => Promise<unknown>, result?: object, args = {}) => {
    const value = result || { data: { data: true } };
    mockedAxios[method].mockResolvedValueOnce(value);

    return func(args)
        .then((resolve) => {
            expect(resolve).toBeTruthy();
        })
        .catch();
};

const fetchReject = async (method: "get" | "post" | "delete" | "put", func: (_: unknown) => Promise<unknown>, args = {}) => {
    const value = { response: { data: true } };
    mockedAxios[method].mockRejectedValueOnce(value);

    return func(args)
        .then()
        .catch((reject) => {
            expect(reject).toBeTruthy();
        });
};

export const fetch = async ({
    method,
    func,
    args,
    result,
}: {
    method: "get" | "post" | "delete" | "put";
    func: any;
    args?: object;
    result?: object;
}) => {
    await fetchResolve(method, func, result, args);
    await fetchReject(method, func, args);
};

export const user = {
    uuid: "uuid",
    userId: "id",
    fullname: "John Cena",
    permission_keys: [],
    role_keys: [],
};

interface ReCaptcha {
    onChange: Mock; 
}

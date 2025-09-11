import { axios, catchHelper, header } from "@libs/axios";

export const getWallet = (userId: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_POINT_URL + `/pub/v1/wallet/${userId}`, {
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data.balance);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getMyWallet = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_POINT_URL + `/pub/v1/wallet/me`, {
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data.balance);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Task {
    isShowWeb: boolean;
    unit: number;
    pointLabel: string;
    title: { id: string };
    subtitle: { id: string };
    image: string;
    log_details: { addedBalancedAt: string }[];
}

export const getTask = (): Promise<Task[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_POINT_URL + `/hook-log/v1/me`, {
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data.lists);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface VoucherProps {
    itemId: string;
    itemName: string;
    status: string;
    expDate: string;
    banner: string;
    type: string;
    desc: string;
    price: number;
    isNeedAddress: boolean;
}

export interface Voucher {
    lists?: VoucherProps[];
    totalData?: number;
}
export interface GetVoucher {
    page: number;
    row: number;
    isExpired?: boolean;
    isAvailable?: boolean;
}

export const getVoucher = ({ page, row, isExpired, isAvailable }: GetVoucher): Promise<Voucher> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_POINT_URL + `/v1/item-exchange`, {
                params: {
                    row,
                    page,
                    isExpired,
                    isAvailable,
                },
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface MyVoucher {
    lists?: { item: { itemName: string; expDate: string; price: string; banner: string } }[];
    totalData?: number;
}
export interface GetMyVoucher {
    page: number;
    row: number;
}

export const getMyVoucher = ({ page, row }: GetMyVoucher): Promise<MyVoucher> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_POINT_URL + `/pub/v1/exchange/voucher`, {
                params: {
                    row,
                    page,
                    sort: "newest",
                },
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getPointExchange = (args: any): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_POINT_URL + `/pub/v1/exchange/exchange-point`, args, {
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

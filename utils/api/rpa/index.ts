import { axios, catchHelper, header } from "@libs/axios";

export type Status = "Active" | "Inactive" | "null";
export type Type = "Static" | "DHCP" | "null";

export interface ParamsDeviceConnected {
    date_start: string;
    date_end: string;
    status: string;
    type: string;
    page: number;
    row: number;
    sn: string;
}

export interface ListDeviceConnected {
    client_mac_address: string;
    client_name: string;
    id: number;
    interface: string;
    ip_client: string;
    key: string;
    rssi: string | null | number;
    rx_rate: null | string | number;
    snr: null | string | number;
    status: string;
    time_lease: string;
    tx_rate: null | string | number;
    type: string;
    updated_at: string;
}

interface DeviceConnected {
    filteredCount: string;
    lists: ListDeviceConnected[];
    totalCount: string;
}

let deviceConnectedController: AbortController;
export const getDeviceConnected = (params: any): Promise<DeviceConnected> => {
    if (deviceConnectedController) deviceConnectedController.abort();
    deviceConnectedController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_RPA_URL +
                    `/api/rpa/v1/device-connected/internal/list?row=${params?.row}&page=${params?.page}${
                        params?.status ? "&status[]=" + params?.status : ""
                    }${params?.type ? "&type[]=" + params?.type : ""}${params?.sn ? "&sn=" + params?.sn : ""}&date_start=${
                        params?.date_start
                    }&date_end=${params?.date_end}`,
                {
                    headers: { Authorization: header().Authorization },
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

type Realm = "telkom.net";

export interface DeviceConnectedNd {
    key: string;
    total: number;
    updated_at: string;
}

let deviceConnectedByNd: AbortController;
export const getDeviceConnectedByNd = (params: { nd: number; realm?: Realm }): Promise<DeviceConnectedNd> => {
    if (deviceConnectedByNd) deviceConnectedByNd.abort();
    deviceConnectedByNd = new AbortController();

    const { nd, realm } = params;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_RPA_URL + `/api/rpa/v1/device-connected/internal/nd`, {
                params: {
                    nd,
                    realm,
                },
                headers: { Authorization: header().Authorization },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

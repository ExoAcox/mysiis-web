import { axios, catchHelper, header } from "@libs/axios";

export interface GetSupervisor {
    id: string;
    name?: string;
    mysista_source: string;
    mysista_tahap: string;
    mysista_treg: string;
    mysista_witel: Array<string>;
    telkom_treg: string;
    telkom_witel: Array<string>;
}

export const getSupervisor = (id: string): Promise<GetSupervisor> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/supervisors/v2/${id}`, {
                headers: header(),
                cache: false,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface CreateSupervisor {
    supervisorId: string;
    tahap: number;
    vendor: string;
    regional: string;
    witel: string[];
}

export const createSupervisor = (args: CreateSupervisor): Promise<GetSupervisor> => {
    const { supervisorId, tahap, vendor, regional, witel } = args;

    const formData = new FormData();
    formData.append("supervisorid", supervisorId);
    formData.append("mysista_tahap", String(tahap));
    formData.append("mysista_source", vendor);
    formData.append("mysista_treg", regional);
    formData.append("mysista_witel", JSON.stringify(witel));

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/supervisors/v1/create-supervisor`, formData, {
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

export const deleteSupervisor = (id: string): Promise<GetSupervisor> => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/supervisors/v1/${id}/delete`,
                {},
                {
                    headers: header(),
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

export const getSupervisorAssignment = (params: { row: number; page: number }): Promise<{ lists: unknown[]; totalCount: number }> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/supervisors/v2/list-by-admin`, {
                params,
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

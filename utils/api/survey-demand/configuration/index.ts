import { axios, catchHelper, header } from "@libs/axios";

interface Configuration {
    config_key: string;
    config_value: string;
}

export const getConfiguration = (configurationId: number): Promise<Configuration> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/configurations/v2/${configurationId}`, {
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

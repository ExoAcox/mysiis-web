import { axios, catchHelper, header } from "@libs/axios";

interface GetSurveyCategory {
    filteredCount: string;
    lists: [
        {
            group: string;
            id: number;
            is_show: string;
            name: string;
        }
    ];
    totalCount: string;
}

export const getSurveyCategory = (): Promise<GetSurveyCategory> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/surveys/v1/lists?row=10&page=1`, {
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

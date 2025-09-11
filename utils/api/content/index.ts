import { axios, catchHelper, guestHeader, header } from "@libs/axios";

export interface Faq {
    key: string;
    label: { id: string };
    answer: { id: string };
}

export const getFaqAllCategoryActive = async (): Promise<Faq[]> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_CONTENT_URL + `/faq/v1/categories/all/active`, {
                headers,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface GetFaq {
    categoryKey: string;
    status: string;
}

export const getFaqByCategory = async (params: GetFaq): Promise<Faq[]> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_CONTENT_URL + `/faq/v1/questions/all/category`, {
                params,
                headers,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface GetFaqBySearch {
    row: number;
    page: number;
    keyword: string;
}

export const getFaqBySearch = async (params: GetFaqBySearch): Promise<Faq[]> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_CONTENT_URL + `/faq/v1/questions/search`, {
                params,
                headers,
            })
            .then((response) => {
                resolve(response.data.data?.lists);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface GetFaqByPopularity {
    row: number;
    page: number;
    status: "active" | "inactive";
}

export const getFaqByPopularity = async (params: GetFaqByPopularity): Promise<Faq[]> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_CONTENT_URL + `/faq/v1/questions/popular`, {
                params,
                headers,
            })
            .then((response) => {
                resolve(response.data.data?.lists);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getPointDescription = (params: GetFaq): Promise<Faq[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_CONTENT_URL + `/faq/v1/questions/category/all`, {
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

export interface TermsCondition {
    description?: { id: string };
}

export const getTermsCondition = (): Promise<TermsCondition> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_CONTENT_URL + `/snippets/v1/key/term-of-service`, {
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

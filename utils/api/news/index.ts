import { axios, catchHelper, guestHeader, localStorage } from "@libs/axios";

export interface GetAllParams {
    row: number;
    page: number;
    status: boolean;
}

export interface News {
    id: string;
    title: string;
    article: string;
    image_url: string;
    updated_at: Date;
    created_at: Date;
    view_count: number;
    doc: string;
    doc_urls: string[];
}

interface GetAllNewsResponse {
    lists: News[];
    countFiltered: number;
}

export const getAllNews = async (params: GetAllParams): Promise<GetAllNewsResponse> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_NEWS_URL + `/news/v1`, {
                params,
                headers,
                cache: { ttl: 1000 * 60 * 240, ...localStorage },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Banner {
    id: string;
    image_url: string;
    updated_at: Date;
    created_at: Date;
    url: string;
}

export const getAllBanner = async (params: GetAllParams): Promise<Banner[]> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_NEWS_URL + `/banner/v1`, {
                params,
                headers,
                cache: { ttl: 1000 * 60 * 240, ...localStorage },
            })
            .then((response) => {
                resolve(response.data.data.lists);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getNews = async (newsId: string): Promise<News> => {
    const headers = await guestHeader();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_NEWS_URL + `/news/v1/${newsId}`, {
                headers,
            })
            .then((response) => {
                resolve(response.data.data.lists[0]);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

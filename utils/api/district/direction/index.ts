import { axios, catchHelper, header } from "@libs/axios";

let directionController: AbortController;

interface GetDirection {
    type?: string;
    start_lat: number;
    start_long: number;
    end_lat: number;
    end_long: number;
}

interface Direction {
    geometry: {
        coordinates: Array<[number, number]>;
    };
    properties: {
        summary: {
            distance: number;
            duration: number;
        };
    };
}

export const getDirection = (args: GetDirection): Promise<Direction> => {
    if (directionController) directionController.abort();
    directionController = new AbortController();

    const { type = "foot", start_lat, start_long, end_lat, end_long } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/direction/${type}`, {
                params: { start_lat, start_long, end_lat, end_long },
                headers: header(),
                signal: directionController.signal,
            })
            .then((response) => {
                const features = response.data.data.features[0] || {};
                resolve(features);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

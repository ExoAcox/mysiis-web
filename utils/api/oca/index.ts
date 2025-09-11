import { axios, catchHelper } from "@libs/axios";

interface SendMessageWa {
    phone_number: string;
    message: object;
}

export const sendMessageWA = (body: SendMessageWa) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_OCA_URL + `/api/v2/push/message`, body, {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OCA_TOKEN}`,
                },
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

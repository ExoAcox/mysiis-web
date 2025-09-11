import { NextApiRequest, NextApiResponse } from "next";

const getIp = async (_: NextApiRequest, res: NextApiResponse) => {
    fetch("https://ipinfo.io/json", { method: "GET" })
        .then((response) => {
            return response.json();
        })
        .then((result) => res.send({ data: result }))
        .catch((error) => res.send({ error: error }));
};

export default getIp;

import { NextApiRequest, NextApiResponse } from "next";

const checkHealth = async (_: NextApiRequest, res: NextApiResponse) => {
    res.send({ status: 200, message: "ok" });
};

export default checkHealth;

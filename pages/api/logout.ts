import { deleteCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionApi } from "@libs/session";

export default sessionApi(logout);

function logout(req: NextApiRequest, res: NextApiResponse) {
    deleteCookie(process.env.NEXT_PUBLIC_TOKEN_KEY, { req, res });
    deleteCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY, { req, res });

    req.session.destroy();
    res.send({ success: true });
}

import { NextApiRequest, NextApiResponse } from "next";

import { sessionApi } from "@libs/session";

import { allowedPermissions } from "@data/portofolio";

export default sessionApi(login, "temporary");


async function login(req: NextApiRequest, res: NextApiResponse) {
    const data = {
        ...req.body,
        permission_keys: req.body.permission_keys?.filter((permission: string) => {
            return allowedPermissions.includes(permission);
        }),
    };

    req.session.user = data;
    await req.session.save();
    res.send({ success: true });
}

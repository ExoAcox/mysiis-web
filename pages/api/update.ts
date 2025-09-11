import { NextApiRequest, NextApiResponse } from "next";
// import { Database, open } from "sqlite";
// import sqlite3 from "sqlite3";

import { sessionApi } from "@libs/session";

import { allowedPermissions } from "@data/portofolio";

// let db: Database<sqlite3.Database, sqlite3.Statement> | null;
// const selectQuery = "SELECT * FROM sessions WHERE userId = ?";

export default sessionApi(update);

async function update(req: NextApiRequest, res: NextApiResponse) {
    const data = {
        ...req.body,
        permission_keys: req.body.permission_keys?.filter((permission: string) => {
            return allowedPermissions.includes(permission);
        }),
    };

    // if (!db) {
    //     db = await open({
    //         filename: "./collection.db",
    //         driver: sqlite3.Database,
    //     });
    // }

    // const session = await db.get(selectQuery, req.body.userId);

    // if (session && session.uuid !== req.session.user?.uuid) {
    //     res.send({ success: false });
    // } else {
    //     req.session.user = { ...req.session.user, ...data };
    //     await req.session.save();
    //     res.send({ success: true });
    // }

    req.session.user = { ...req.session.user, ...data };
    await req.session.save();
    res.send({ success: true });
}

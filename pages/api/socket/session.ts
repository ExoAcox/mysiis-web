/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
// import { Database, open } from "sqlite";
// import sqlite3 from "sqlite3";

// let db: Database<sqlite3.Database, sqlite3.Statement> | null;
// const insertQuery = "INSERT INTO sessions(userId, uuid) VALUES(?, ?)";
// const updateQuery = "UPDATE sessions SET uuid = ? WHERE userId = ?";
// const selectQuery = "SELECT * FROM sessions WHERE userId = ?";

const SocketHandler = (_: any, res: any) => {
    if (res.socket.server.io) {
    } else {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", async (socket) => {
            // socket.on("create-session", async ({ userId, uuid }) => {
            //     if (!db) {
            //         db = await open({
            //             filename: "./collection.db",
            //             driver: sqlite3.Database,
            //         });
            //     }

            //     const existingData = await db.get(selectQuery, userId);

            //     if (existingData) {
            //         db.run(updateQuery, [uuid, userId], function (error: FetchError) {
            //             if (error) console.error(error.message);
            //         });
            //     } else {
            //         db.run(insertQuery, [userId, uuid], function (error: FetchError) {
            //             if (error) console.error(error.message);
            //         });
            //     }

            //     socket.broadcast.emit(userId, { uuid });
            // });
        });
    }

    res.end();
};

export default SocketHandler;

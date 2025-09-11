import { Socket, io } from "socket.io-client";

export let socket: Socket;

export const initSocket = async () => {
    await fetch("/api/socket/session");
    socket = io();
};

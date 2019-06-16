/* eslint-disable */
import * as ACTIONS from "./actions";
import { ISocket } from "../types/ISocket";
import { createRoom } from "./actions/createRoom";
import { draw } from "./actions/draw";
import { joinRoom } from "./actions/joinRoom";
import { play } from "./actions/play";

const mapping = {
    [ACTIONS.CREATE_ROOM]: createRoom,
    [ACTIONS.DRAW]: draw,
    [ACTIONS.JOIN_ROOM]: joinRoom,
    [ACTIONS.PLAY]: play,
};

export function actionMapper(socket: ISocket) {
    Object.keys(mapping).forEach((key) => {
        socket.on(key, (data) => {
            // @ts-ignore
            mapping[key](socket, data);
            // console.log("event", key, "data", data);
            // switch (key) {
            //     case ACTIONS.CREATE_ROOM:
            //         createRoom(socket, data.numPlayer, data.playerID);
            //         break;
            // }
        });
    });
}

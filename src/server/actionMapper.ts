/* eslint-disable */
import * as ACTIONS from "./actions";
import { ISocket } from "../types/ISocket";
import { createRoom } from "./actions/createRoom";
import { draw } from "./actions/draw";
import { joinRoom } from "./actions/joinRoom";
import { play } from "./actions/play";
import { trayMove } from "./actions/trayMove";

const mapping = {
    [ACTIONS.CREATE_ROOM]: createRoom,
    [ACTIONS.DRAW]: draw,
    [ACTIONS.JOIN_ROOM]: joinRoom,
    [ACTIONS.PLAY]: play,
    [ACTIONS.TRAY_MOVE]: trayMove,
};

export function actionMapper(socket: ISocket) {
    Object.keys(mapping).forEach((key) => {
        socket.on(key, (data) => {
            // @ts-ignore
            mapping[key](socket, data);
        });
    });
}

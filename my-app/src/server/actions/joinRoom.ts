import * as GameStateStore from "../GameStateStore";
import * as ACTIONS from "../actions";
import { sendState } from "../sendState";
import { ISocket } from "../../types/ISocket";

function assignPlayer(socket: ISocket, playerID: string) {
    socket.playerID = playerID === null ? socket.id : playerID;
    const state = GameStateStore.get(socket.roomID);
    if (state.players.indexOf(socket.playerID) === -1) {
        const idx = state.players.indexOf("");
        console.log("idx found", idx);
        state.players[idx] = playerID;
    }
}

export interface IJoinRoomParam {
    roomID: string;
    playerID: string;
}

export function joinRoom(
    socket: ISocket,
    { roomID, playerID }: IJoinRoomParam
) {
    console.log("JOIN room", roomID, "player", playerID);
    if (!GameStateStore.has(roomID)) {
        socket.emit(ACTIONS.GAME_RESET);
        return;
    }

    socket.roomID = roomID; // eslint-disable-line
    socket.join(roomID);
    assignPlayer(socket, playerID);
    sendState(socket);
}

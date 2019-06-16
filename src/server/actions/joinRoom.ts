import * as GameStateStore from "../GameStateStore";
import * as ACTIONS from "../actions";
import { sendState } from "../sendState";
import { ISocket } from "../../types/ISocket";

function assignPlayer(socket: ISocket, playerID: string) {
    socket.playerID = playerID === null ? socket.id : playerID;
    const state = GameStateStore.get(socket.roomID);
    let idx = state.players.indexOf(socket.playerID);
    console.log("idx found", idx);
    if (idx === -1) {
        console.log("does not know this player");
        const iddx = state.players.indexOf("");
        console.log("New Player will be ", iddx);
        state.players[iddx] = playerID;
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

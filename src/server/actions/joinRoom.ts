import * as GameStateStore from "../GameStateStore";
import * as ACTIONS from "../actions";
import * as Send from "../send";
import { ISocket } from "../../types/ISocket";

function assignPlayer(socket: ISocket, playerID: string) {
    socket.playerID = playerID === null ? socket.id : playerID;
    const state = GameStateStore.get(socket.roomID);
    console.log("Game players", state.players);
    let idx = state.players.indexOf(socket.playerID);
    console.log("idx found", idx);
    if (idx === -1) {
        console.log("does not know this player");
        const freeSpotIdx = state.players.indexOf("");
        console.log(
            "New Player will be ",
            freeSpotIdx,
            "player size",
            state.players.length
        );
        if (freeSpotIdx === -1 || freeSpotIdx > state.players.length) {
            throw new Error("Invalid player ID idx '" + freeSpotIdx + "'");
        }
        state.players[freeSpotIdx] = playerID;
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
        console.log("Room does not exist. Send Reset");
        socket.emit(ACTIONS.GAME_RESET);
        return;
    }

    socket.roomID = roomID; // eslint-disable-line
    socket.join(roomID);
    assignPlayer(socket, playerID);

    Send.gameState(socket);
    Send.playerTray(socket);
}

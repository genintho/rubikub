import { ISocket } from "../../types/ISocket";
import * as ACTIONS from "../actions";
import * as GameStateStore from "../GameStateStore";
import { ITrayMoveActionPayload } from "../../types/GameAction";

export function trayMove(socket: ISocket, data: ITrayMoveActionPayload) {
    console.log(ACTIONS.TRAY_MOVE, socket.roomID);
    const state = GameStateStore.get(socket.roomID);
    const playerIdx = state.players.indexOf(socket.playerID);
    if (playerIdx !== -1) {
        state.playersHand[playerIdx] = data.playerTray;
    }
}

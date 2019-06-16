import * as GameStateStore from "./GameStateStore";
import * as ACTIONS from "./actions";
import { IPlayerGameState } from "../types/Game";

export function sendState(socket: any) {
    const state = GameStateStore.get(socket.roomID);
    const tray = state.playersHand[state.players.indexOf(socket.playerID)];
    const payload: IPlayerGameState = {
        playerTray: tray,
        board: state.board,
        playerID: socket.playerID,
        players: state.players,
        turn: state.turn,
        playerTurn: state.players[state.turn % state.players.length],
    };
    socket.emit(ACTIONS.GAME_STATE, payload);
}

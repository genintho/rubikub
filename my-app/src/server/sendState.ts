import * as GameStateStore from "./GameStateStore";
import * as ACTIONS from "./actions";
import { IPlayerGameState } from "../types/Game";

export function sendState(socket: any) {
    const state = GameStateStore.get(socket.roomID);
    const tray = state.playersHand[state.players.indexOf(socket.playerID)];
    const payload: IPlayerGameState = {
        playerTray: tray ? tray.toJS() : [],
        board: state.board.toJS(),
        playerID: socket.playerID,
        players: state.players,
        turn: state.turn,
    };
    socket.emit(ACTIONS.GAME_STATE, payload);
}

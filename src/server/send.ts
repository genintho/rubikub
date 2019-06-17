import * as GameStateStore from "./GameStateStore";
import * as ACTIONS from "./actions";
import { IPlayerGameState } from "../types/Game";
import { IPlayerTrayActionPayload } from "../types/GameAction";
import { ISocket } from "../types/ISocket";

export function gameState(socket: any) {
    const state = GameStateStore.get(socket.roomID);
    const payload: IPlayerGameState = {
        board: state.board,
        playerID: socket.playerID,
        players: state.players,
        turn: state.turn,
        playerTurn: state.players[state.turn % state.players.length],
    };
    socket.emit(ACTIONS.NEW_GAME_STATE, payload);
    socket.broadcast.emit(ACTIONS.NEW_GAME_STATE, payload);
}

export function playerTray(socket: any) {
    const state = GameStateStore.get(socket.roomID);
    const tray = state.playersHand[state.players.indexOf(socket.playerID)];
    const payload: IPlayerTrayActionPayload = {
        playerTray: tray,
    };
    socket.emit(ACTIONS.PLAYER_TRAY, payload);
}

export function errorMove(socket: ISocket) {
    const state = GameStateStore.get(socket.roomID);
    const tray = state.playersHand[state.players.indexOf(socket.playerID)];
    socket.emit(ACTIONS.ERROR_MOVE, "INVALID MOVE, RESET STATE");
    playerTray(socket);
    gameState(socket);
}

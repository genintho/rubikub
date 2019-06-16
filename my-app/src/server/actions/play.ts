import { ISocket } from "../../types/ISocket";

const GameStateStore = require("../GameStateStore");
const ACTIONS = require("../actions");
const sendState = require("../sendState").sendState;

export interface IPlayAction {
    board: string;
    playerTray: string;
}

export function play(socket: ISocket, { board, playerTray }: IPlayAction) {
    console.log(socket.roomID, socket.playerID, board);
    const state = GameStateStore.get(socket.roomID);
    // @TODO add check that the correct user is playing
    state.turn += 1;
    state.board = board;
    state.playersHand[state.players.indexOf(socket.playerID)] = playerTray;
    sendState(socket);
    socket.broadcast.emit(ACTIONS.RELOAD);
}

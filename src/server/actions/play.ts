import { ISocket } from "../../types/ISocket";
import { IPlayActionPayload } from "../../types/GameAction";
import { isValidMove } from "../../lib/isValidMove";
import { createModels } from "../../lib/createModels";

const GameStateStore = require("../GameStateStore");
const Send = require("../send");

export function play(
    socket: ISocket,
    { board, playerTray }: IPlayActionPayload
) {
    console.log("PLAY", "room", socket.roomID, "playeR", socket.playerID);
    const state = GameStateStore.get(socket.roomID);
    // @TODO add check that the correct user is playing

    // User click play, let's check the state of the game
    // 1. Make sure all board pieces are still there
    // 2. Build all the groups of pieces we can find
    // 3. Make sure all the groups are valid
    if (!isValidMove(createModels(board), createModels(state.board))) {
        Send.errorMove(socket);
        return;
    }

    state.turn += 1;
    state.board = board;
    state.playersHand[state.players.indexOf(socket.playerID)] = playerTray;
    // sendState(socket);
    Send.gameState(socket);
}

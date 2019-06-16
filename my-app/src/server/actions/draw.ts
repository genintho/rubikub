import * as GameStateStore from "../GameStateStore";
import * as ACTIONS from "../actions";
import { sendState } from "../sendState";
import * as _ from "lodash";
import { TileRow } from "../../types/Game";

export function draw(socket: any) {
    console.log("Draw");

    const state = GameStateStore.get(socket.roomID);
    const pickIdx = _.random(0, state.bucket.length - 1);
    const picks = [state.bucket.splice(pickIdx, 1)[0]];
    const playerIdx = state.players.indexOf(socket.playerID);
    state.playersHand[playerIdx].forEach((row: TileRow, rowIdx: number) => {
        row.forEach((cell, cellIdx) => {
            if (cell === null && picks.length) {
                const pick = picks.pop();
                if (pick) {
                    state.playersHand[playerIdx] = state.playersHand[
                        playerIdx
                    ].setIn([rowIdx, cellIdx], pick);
                }
            }
        });
    });
    state.turn += 1;
    sendState(socket);
    socket.broadcast.emit(ACTIONS.RELOAD);
}

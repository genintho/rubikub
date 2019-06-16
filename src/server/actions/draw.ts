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
    let pick: any = null;
    state.playersHand[playerIdx].forEach((row: TileRow, rowIdx: number) => {
        console.log("row", rowIdx);
        row.forEach((cell, cellIdx) => {
            console.log("row", rowIdx, "cell", cellIdx, cell);
            if (pick === null && cell === null && picks.length) {
                console.log("found a spot");
                pick = picks.pop();
                if (pick) {
                    console.log("player", socket.playerID, " pick", pick);
                    state.playersHand[playerIdx][rowIdx][cellIdx] = pick;
                }
            }
        });
    });
    state.turn += 1;
    sendState(socket);
    socket.broadcast.emit(ACTIONS.RELOAD);
}

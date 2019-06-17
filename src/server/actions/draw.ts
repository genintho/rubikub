import * as GameStateStore from "../GameStateStore";
import * as Send from "../send";
import * as _ from "lodash";
import { TileRow } from "../../types/Game";

export function draw(socket: any) {
    const state = GameStateStore.get(socket.roomID);
    const pickIdx = _.random(0, state.bucket.length - 1);
    const picks = [state.bucket.splice(pickIdx, 1)[0]];
    const playerIdx = state.players.indexOf(socket.playerID);
    let pick: any = null;
    state.playersHand[playerIdx].forEach((row: TileRow, rowIdx: number) => {
        row.forEach((cell, cellIdx) => {
            if (pick === null && cell === null && picks.length) {
                pick = picks.pop();
                if (pick) {
                    state.playersHand[playerIdx][rowIdx][cellIdx] = pick;
                }
            }
        });
    });
    state.turn += 1;
    console.log("DRAW", "player", socket.playerID, " pick", pick);
    // send(socket);
    Send.gameState(socket);
    Send.playerTray(socket);
}

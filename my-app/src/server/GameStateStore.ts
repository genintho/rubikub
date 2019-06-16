import _ from "lodash"; // eslint-disable-line
import { TileModel, TileColors } from "../models/TileModel";
import { IBoard } from "../types/Game";
import { IPlayerTray } from "../types/Game";
import { IGameState } from "../types/Game";
import { List } from "immutable";

const gameState: Map<string, IGameState> = new Map();

export function createInitialState(
    roomID: string,
    numPlayer: number,
    playerID: string
) {
    const allTiles: TileModel[] = [];

    Object.values(TileColors).forEach((color) => {
        for (let it = 0; it < 2; it += 1) {
            for (let value = 1; value < 14; value += 1) {
                allTiles.push(new TileModel(it, color, String(value)));
            }
        }
    });

    const playersHand: any = [];
    const players: string[] = [];
    for (let playerIdx = 0; playerIdx < numPlayer; playerIdx += 1) {
        players[playerIdx] = "";
        playersHand[playerIdx] = List();
        playersHand[playerIdx] = playersHand[playerIdx].set(0, List());
        playersHand[playerIdx] = playersHand[playerIdx].set(1, List());
        playersHand[playerIdx] = playersHand[playerIdx].set(2, List());

        for (let pickNum = 0; pickNum < 14; pickNum += 1) {
            const pickIdx = _.random(0, allTiles.length - 1);
            playersHand[playerIdx] = playersHand[playerIdx].setIn(
                [0, pickNum],
                allTiles.splice(pickIdx, 1)
            );
        }
    }

    let board: IBoard = List();
    for (let rowIdx = 0; rowIdx < 10; rowIdx += 1) {
        let row = List();
        for (let columnIdx = 0; columnIdx < 14; columnIdx += 1) {
            row = row.set(columnIdx, null);
        }
        board = board.set(rowIdx, row);
    }
    gameState.set(roomID, {
        bucket: allTiles,
        playersHand,
        players,
        // table: tableState,
        board,
        turn: 0,
    });
    return roomID;
}

export function get(id: string): IGameState {
    const token = gameState.get(id);
    if (token) {
        return token;
    }
    throw new Error("Can not find game");
}

export function has(id: string) {
    return gameState.has(id);
}

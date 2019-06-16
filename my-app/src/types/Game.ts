import { TileModel } from "../models/TileModel";
import { List } from "immutable";

export type TileRow = List<TileModel | null>;
export type IGroupTile = List<TileRow>;
export type IPlayerTray = IGroupTile;
export type IBoard = IGroupTile;

export type IPlayerID = string;
export type IPlayers = string[];

// export type IPlayerTray = [TileRow, TileRow, TileRow];

export interface ITileJSON {
    readonly set: number;
    readonly color: string;
    readonly value: string;
}

export interface IGameState {
    bucket: TileModel[];
    playersHand: IPlayerTray[];
    players: IPlayers;
    // table: tableState,
    board: IBoard;
    turn: number;
}

export interface IPlayerGameState {
    playerID: IPlayerID;
    playerTray: ITileJSON[][];
    players: IPlayers;
    board: ITileJSON[][];
    turn: number;
}

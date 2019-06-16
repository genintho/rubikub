import { TileModel } from "../models/TileModel";

export type TileRow = (TileModel | null)[];
export type IGroupTile = TileRow[];
// export type IPlayerTray = IGroupTile;
export type IBoard = IGroupTile;

export type IPlayerID = string;
export type IPlayers = string[];

export type IPlayerTray = IGroupTile;

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
    playerTray: IGroupTile;
    players: IPlayers;
    board: IBoard;
    turn: number;
    playerTurn: string;
}

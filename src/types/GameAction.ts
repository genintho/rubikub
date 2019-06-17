import { IBoard, IPlayerTray } from "./Game";

export interface IPlayActionPayload {
    board: IBoard;
    playerTray: IPlayerTray;
}

export interface IPlayerTrayActionPayload {
    playerTray: IPlayerTray;
}

export interface ITrayMoveActionPayload {
    playerTray: IPlayerTray;
}

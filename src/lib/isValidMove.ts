import { hasAllBoardPieces, hasMoved } from "./validators";
import { buildTileGroups } from "./buildTileGroups";
import { IBoard } from "../types/Game";

export function isValidMove(currentBoard: IBoard, previousBoard: IBoard) {
    const hasAllBoardP = hasAllBoardPieces(currentBoard, previousBoard);
    const buildTileG = buildTileGroups(currentBoard).reduce(
        (isValid, group) => {
            return isValid && group.isValid();
        },
        true
    );
    const hasMov = hasMoved(currentBoard, previousBoard);
    console.log("isValidMove");
    console.log("hasAllBoardPieces", hasAllBoardP);
    console.log("buildTileG", buildTileG);
    console.log("hasMov", hasMov);
    return (
        // @TODO check 30 points on first move
        // @TODO check that the board has a new pieces
        hasAllBoardP &&
        // eslint-disable-next-line
        buildTileG &&
        hasMov
    );
}

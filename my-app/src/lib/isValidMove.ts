import { hasAllBoardPieces } from "./validators/hasAllBoardPieces";
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
    console.log("isValidMove");
    console.log("hasAllBoardPieces", hasAllBoardP);
    console.log("buildTileG", buildTileG);
    return (
        // @TODO check 30 points on first move
        // @TODO check that the board has a new pieces
        hasAllBoardP &&
        // eslint-disable-next-line
        buildTileG
    );
}

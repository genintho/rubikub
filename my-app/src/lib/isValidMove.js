import { hasAllBoardPieces } from "./validators/hasAllBoardPieces";
import { buildTileGroups } from "./buildTileGroups";

export function isValidMove(currentBoard, previousBoard) {
    return (
        // @TODO check 30 points on first move
        // @TODO check that the board has a new pieces
        hasAllBoardPieces(currentBoard, previousBoard) &&
        // eslint-disable-next-line
        buildTileGroups(currentBoard).reduce((isValid, group) => {
            return isValid && group.isValid();
        }, true)
    );
}

import { IBoard } from "../types/Game";

export function hasAllBoardPieces(
    currentBoard: IBoard,
    previousBoard: IBoard
): boolean {
    const newBoardTiles = new Set();
    currentBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell) {
                newBoardTiles.add(cell.id);
            }
        });
    });
    let hasAllPieces = true;
    previousBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell && !newBoardTiles.has(cell.id)) {
                hasAllPieces = false;
            }
        });
    });

    return hasAllPieces;
}

export function hasMoved(currentBoard: IBoard, previousBoard: IBoard): boolean {
    const newBoardTiles = new Set();
    currentBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell) {
                newBoardTiles.add(cell.id);
            }
        });
    });
    previousBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell && newBoardTiles.has(cell.id)) {
                newBoardTiles.delete(cell.id);
            }
        });
    });
    return newBoardTiles.size > 0;
}

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
    console.log(currentBoard, previousBoard);
    const newBoardTiles = new Set();
    currentBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell) {
                newBoardTiles.add(cell.id);
            }
        });
    });
    console.log(newBoardTiles);
    previousBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell && newBoardTiles.has(cell.id)) {
                newBoardTiles.delete(cell.id);
            }
        });
    });
    console.log(newBoardTiles);
    return newBoardTiles.size > 0;
}

module.exports = function hasAllBoardPieces(currentBoard, previousBoard) {
    console.log("hasAllBoardPieces");
    console.log(currentBoard.toJS());
    console.log(previousBoard.toJS());
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
};

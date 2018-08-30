const hasAllBoardPieces = require("./validators/hasAllBoardPieces");
const buildTileGroups = require("./buildTileGroups");

module.exports = function isValidMove(currentBoard, previousBoard) {
    return (
        // @TODO check that the board has a new pieces
        hasAllBoardPieces(currentBoard, previousBoard) &&
        // eslint-disable-next-line
        buildTileGroups(currentBoard).reduce((isValid, group) => {
            return isValid && group.isValid();
        }, true)
    );
};

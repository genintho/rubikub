const TileGroupModel = require("../models/TileGroupModel");

module.exports = function buildTileGroups(board) {
    const groups = [];
    board.forEach((row) => {
        let previsCell = false;
        let curGroup = null;
        row.forEach((cell) => {
            if (cell !== null) {
                // We are seeing a new group
                if (previsCell === false) {
                    curGroup = new TileGroupModel();
                    groups.push(curGroup);
                }
                previsCell = true;
                curGroup.add(cell);
            }
            if (cell === null) {
                if (previsCell === true) {
                    curGroup = null;
                }
                previsCell = false;
            }
        });
    });
    return groups;
};

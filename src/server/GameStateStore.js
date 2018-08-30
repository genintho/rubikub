const _random = require("lodash/random"); // eslint-disable-line
const Tile = require("../models/TileModel");

const gameState = new Map();

function createInitialState(roomID, numPlayer) {
    const allTiles = [];

    Object.values(Tile.COLORS).forEach((color) => {
        for (let it = 0; it < 2; it += 1) {
            for (let value = 1; value < 14; value += 1) {
                allTiles.push(new Tile(it, color, value));
            }
        }
    });

    const playersHand = [];
    const players = [];
    for (let playerIdx = 0; playerIdx < numPlayer; playerIdx += 1) {
        playersHand[playerIdx] = [[], [], []];
        players[playerIdx] = null;
        for (let pickNum = 0; pickNum < 14; pickNum += 1) {
            const pickIdx = _random(0, allTiles.length - 1);
            playersHand[playerIdx][0].push(allTiles.splice(pickIdx, 1)[0]);
            playersHand[playerIdx][1].push(null);
            playersHand[playerIdx][2].push(null);
        }
    }

    const board = [];
    for (let rowIdx = 0; rowIdx < 10; rowIdx += 1) {
        board[rowIdx] = [];
        for (let columnIdx = 0; columnIdx < 14; columnIdx += 1) {
            board[rowIdx][columnIdx] = null;
        }
    }
    gameState.set(roomID, {
        bucket: allTiles,
        playersHand,
        players,
        // table: tableState,
        board,
        turn: 0,
    });
    return roomID;
}

module.exports = {
    createInitialState,
    get: (id) => gameState.get(id),
    has: (id) => gameState.has(id),
};

const GameStateStore = require("../GameStateStore");
const ACTIONS = require("../actions");
const sendState = require("../sendState");
const _random = require("lodash/random"); // eslint-disable-line

module.exports = function draw(socket) {
    console.log("Draw");

    const state = GameStateStore.get(socket.roomID);
    const pickIdx = _random(0, state.bucket.length - 1);
    const picks = [state.bucket.splice(pickIdx, 1)[0]];
    const playerIdx = state.players.indexOf(socket.playerID);
    state.playersHand[playerIdx].forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            if (cell === null && picks.length) {
                state.playersHand[playerIdx][rowIdx][cellIdx] = picks.pop();
            }
        });
    });
    state.turn += 1;
    sendState(socket);
    socket.broadcast.emit(ACTIONS.RELOAD);
};

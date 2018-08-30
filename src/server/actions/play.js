const GameStateStore = require("../GameStateStore");
const ACTIONS = require("../actions");
const sendState = require("../sendState");

module.exports = function play(socket, { board, playerTray }) {
    console.log(socket.roomID, socket.playerID, board);
    const state = GameStateStore.get(socket.roomID);
    // @TODO add check that the correct user is playing
    state.turn += 1;
    state.board = JSON.parse(board);
    state.playersHand[state.players.indexOf(socket.playerID)] = JSON.parse(
        playerTray
    );
    sendState(socket);
    socket.broadcast.emit(ACTIONS.RELOAD);
};

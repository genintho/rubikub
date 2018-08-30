const GameStateStore = require("./GameStateStore");
const ACTIONS = require("./actions");

module.exports = function sendState(socket) {
    const state = GameStateStore.get(socket.roomID);
    socket.emit(ACTIONS.GAME_STATE, {
        playerTray: state.playersHand[state.players.indexOf(socket.playerID)],
        board: state.board,
        playerID: socket.playerID,
        players: state.players,
        turn: state.turn,
    });
};

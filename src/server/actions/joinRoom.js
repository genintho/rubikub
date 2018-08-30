const GameStateStore = require("../GameStateStore");
const ACTIONS = require("../actions");
const sendState = require("../sendState");

function assignPlayer(socket, playerID) {
    socket.playerID = playerID === null ? socket.id : playerID; // eslint-disable-line
    const state = GameStateStore.get(socket.roomID);
    if (state.players.indexOf(socket.playerID) === -1) {
        state.players[state.players.indexOf(null)] = playerID;
    }
}

module.exports = function joinRoom(socket, { roomID, playerID }) {
    console.log("JOIN room", roomID, "player", playerID);
    if (!GameStateStore.has(roomID)) {
        socket.emit(ACTIONS.GAME_RESET);
        return;
    }

    socket.roomID = roomID; // eslint-disable-line
    socket.join(roomID);
    assignPlayer(socket, playerID);
    sendState(socket);
};

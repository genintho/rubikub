const ACTIONS = require("../actions");
const { createInitialState } = require("../GameStateStore");

module.exports = (socket, { numPlayer, playerID }) => {
    const roomID = createInitialState(socket.id, numPlayer);
    socket.roomID = roomID; // eslint-disable-line
    console.log("CREATE ROOM", roomID);
    socket.join(roomID);
    if (!playerID) {
        playerID = socket.id; // eslint-disable-line
    }

    socket.emit(ACTIONS.CREATED_ROOM, {
        roomID,
        playerID,
    });
};

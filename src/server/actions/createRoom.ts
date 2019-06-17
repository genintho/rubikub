import * as ACTIONS from "../actions";
const { createInitialState } = require("../GameStateStore");

export function createRoom(
    socket: any,
    data: { numPlayer: number; playerID: string }
) {
    let playerID = data.playerID;
    if (!playerID) {
        playerID = socket.id; // eslint-disable-line
    }
    const roomID = createInitialState(socket.id, data.numPlayer, playerID);
    socket.roomID = roomID; // eslint-disable-line
    console.log("CREATE ROOM", roomID, "player", playerID);
    socket.join(roomID);

    socket.emit(ACTIONS.CREATED_ROOM, {
        roomID,
        playerID,
    });
}

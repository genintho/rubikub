import * as ACTIONS from "../actions";
const { createInitialState } = require("../GameStateStore");

export function createRoom(
    socket: any,
    data: { numPlayer: number; playerID: string }
) {
    const roomID = createInitialState(socket.id, data.numPlayer, data.playerID);
    socket.roomID = roomID; // eslint-disable-line
    console.log("CREATE ROOM", roomID);
    socket.join(roomID);
    let playerID = data.playerID;
    if (!playerID) {
        playerID = socket.id; // eslint-disable-line
    }

    socket.emit(ACTIONS.CREATED_ROOM, {
        roomID,
        playerID,
    });
}

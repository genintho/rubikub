function drawTable() {
    const container = document.getElementById("app");
}

function processGameStateMsg() {
    console.log(msg);
    const playerHand = gameState.playerHand.map((item) => {
        return new TileModel(item.group, item.color, item.value);
    });
    return { playerHand, table: gameState.table };
}

function connectSocket() {
    const socket = io("localhost:3000");

    socket.on("connect", function() {
        // Connected , let's sign-up for to receive messages for this room
        if (location.hash.length === 0) {
            console.log("need to create a room");
            const numPlayer = prompt("How many player?");
            socket.emit(ACTIONS.CREATE_ROOM, {
                numPlayer: parseInt(numPlayer, 10),
            });
        } else {
            console.log("join room");
            socket.emit(
                ACTIONS.JOIN_ROOM,
                location.hash.substr(1, location.hash.length)
            );
        }
    });
    socket.on("RESET", () => {
        location.href = "/";
    });
    socket.on(ACTIONS.CREATED_ROOM, (msg) => {
        location.hash = msg.roomID;
        console.log(msg);
    });
    socket.on(ACTIONS.GAME_STATE, (msg) => {
        processGameStateMsg(msg);
    });
}

export default function() {
    connectSocket();
}

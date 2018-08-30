const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const actionMapper = require("./actionMapper");

// const TileModel = require("../models/TileGroupModel");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "index.html");

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));

    actionMapper(socket);
    // socket.on(ACTIONS.TRAY_MOVE, (msg) => {
    //     console.log(ACTIONS.TRAY_MOVE, socket.roomID);
    //     const state = gameState.get(socket.roomID);
    //     state.playersHand[msg.playerID] = msg.playerHand;
    // });
});

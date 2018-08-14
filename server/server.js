"use strict";

const express = require("express");
const socketIO = require("socket.io");
const ACTIONS = require("./actions");
const path = require("path");
const Tile = require("../models/Tile");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "index.html");

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
const gameState = new Map();

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
    socket.on(ACTIONS.JOIN_ROOM, function(roomID) {
        console.log("JOIN room", roomID);
        if (!gameState.has(roomID)) {
            socket.emit("RESET");
            return;
        }
        socket.join(roomID);
        sendState(roomID, socket);
    });
    socket.on(ACTIONS.CREATE_ROOM, function(msg) {
        const roomID = socket.id;
        console.log("CREATE ROOM", roomID);
        socket.join(roomID);
        createGameInitialState(roomID, msg.numPlayer);
        socket.emit(ACTIONS.CREATED_ROOM, {
            roomID,
        });
        sendState(roomID, socket);
    });
});

function sendState(id, socket) {
    const state = gameState.get(id);
    socket.emit(ACTIONS.GAME_STATE, {
        playerHand: state.playersHand[state.turn % state.playersHand.length],
        table: state.table,
    });
}

function createGameInitialState(id, numPlayer) {
    const allTiles = [];

    Object.values(Tile.COLORS).forEach((color) => {
        for (let it = 0; it < 2; it++) {
            for (let value = 1; value < 14; value++) {
                allTiles.push(new Tile(it, color, value));
            }
        }
    });

    const playersHand = [];
    for (let playerIdx = 0; playerIdx < numPlayer; playerIdx++) {
        playersHand[playerIdx] = [];
        for (let pickNum = 0; pickNum < 14; pickNum++) {
            const pickIdx = getRandomInt(0, allTiles.length - 1);
            playersHand[playerIdx].push(allTiles.splice(pickIdx, 1)[0]);
        }
    }

    gameState.set(id, {
        bucket: allTiles,
        playersHand,
        table: {},
        turn: 0,
    });
}

function getRandomInt(min2, max2) {
    const min = Math.ceil(min2);
    const max = Math.floor(max2);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

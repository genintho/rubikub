"use strict";

const express = require("express");
const socketIO = require("socket.io");
const ACTIONS = require("./actions");
const path = require("path");
const Tile = require("../models/TileModel");
const TileModel = require("../models/TileGroupModel");

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

    socket.on(ACTIONS.TRAY_MOVE, (msg) => {
        const roomID = msg.roomID;
        console.log(ACTIONS.TRAY_MOVE, roomID);
        const state = gameState.get(roomID);
        state.playersHand[msg.playerID] = msg.playerHand;
    });
});

function sendState(id, socket) {
    const state = gameState.get(id);
    socket.emit(ACTIONS.GAME_STATE, {
        playerHand: state.playersHand[state.turn % state.playersHand.length],
        board: state.board,
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
        playersHand[playerIdx] = [[], [], []];
        for (let pickNum = 0; pickNum < 14; pickNum++) {
            const pickIdx = getRandomInt(0, allTiles.length - 1);
            playersHand[playerIdx][0].push(allTiles.splice(pickIdx, 1)[0]);
            playersHand[playerIdx][1].push(null);
            playersHand[playerIdx][2].push(null);
        }
    }
    //
    // const tableState = [];
    // const group1 = new TileModel();
    // group1.add(playersHand[0][1]);
    // group1.add(playersHand[0][2]);
    // const group2 = new TileModel();
    // group2.add(playersHand[0][3]);
    // group2.add(playersHand[0][4]);
    // group2.add(playersHand[0][5]);
    // const group3 = new TileModel();
    // group3.add(playersHand[0][6]);
    // group3.add(playersHand[0][7]);
    // tableState[0] = [group1, group2];
    // tableState[1] = [group3];
    const board = [];
    for (let rowIdx = 0; rowIdx < 10; rowIdx++) {
        board[rowIdx] = [];
        for (let columnIdx = 0; columnIdx < 14; columnIdx++) {
            board[rowIdx][columnIdx] = null;
        }
    }
    board[1][5] = playersHand[0][1];
    gameState.set(id, {
        bucket: allTiles,
        playersHand,
        // table: tableState,
        board,
        turn: 0,
    });
}

function getRandomInt(min2, max2) {
    const min = Math.ceil(min2);
    const max = Math.floor(max2);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

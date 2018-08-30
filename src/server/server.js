/* eslint-disable no-plusplus */
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const _random = require("lodash/random"); // eslint-disable-line
const ACTIONS = require("./actions");
const Tile = require("../models/TileModel");
// const TileModel = require("../models/TileGroupModel");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "index.html");

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
const gameState = new Map();

function sendState(socket) {
    const state = gameState.get(socket.roomID);
    socket.emit(ACTIONS.GAME_STATE, {
        playerTray: state.playersHand[state.players.indexOf(socket.playerID)],
        board: state.board,
        playerID: socket.playerID,
        players: state.players,
        turn: state.turn,
    });
}

function assignPlayer(socket, playerID) {
    socket.playerID = playerID === null ? socket.id : playerID; // eslint-disable-line
    const state = gameState.get(socket.roomID);
    if (state.players.indexOf(socket.playerID) === -1) {
        state.players[state.players.indexOf(null)] = playerID;
    }
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
    const players = [];
    for (let playerIdx = 0; playerIdx < numPlayer; playerIdx++) {
        playersHand[playerIdx] = [[], [], []];
        players[playerIdx] = null;
        for (let pickNum = 0; pickNum < 14; pickNum++) {
            const pickIdx = _random(0, allTiles.length - 1);
            playersHand[playerIdx][0].push(allTiles.splice(pickIdx, 1)[0]);
            playersHand[playerIdx][1].push(null);
            playersHand[playerIdx][2].push(null);
        }
    }

    const board = [];
    for (let rowIdx = 0; rowIdx < 10; rowIdx++) {
        board[rowIdx] = [];
        for (let columnIdx = 0; columnIdx < 14; columnIdx++) {
            board[rowIdx][columnIdx] = null;
        }
    }
    gameState.set(id, {
        bucket: allTiles,
        playersHand,
        players,
        // table: tableState,
        board,
        turn: 0,
    });
}

function draw(socket) {
    const state = gameState.get(socket.roomID);
    const pickIdx = _random(0, state.bucket.length - 1);
    const picks = [state.bucket.splice(pickIdx, 1)[0]];
    const playerIdx = state.players.indexOf(socket.playerID);
    state.playersHand[playerIdx].forEach((row, rowIdx) => {
        row.forEach((cell, cellIdx) => {
            if (cell === null && picks.length) {
                state.playersHand[playerIdx][rowIdx][cellIdx] = picks.pop();
            }
        });
    });
    state.turn += 1;
    sendState(socket);
}

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));

    socket.on(ACTIONS.CREATE_ROOM, ({ numPlayer, playerID }) => {
        const roomID = socket.id;
        socket.roomID = roomID; // eslint-disable-line
        console.log("CREATE ROOM", roomID);
        socket.join(roomID);
        if (!playerID) {
            playerID = socket.id; // eslint-disable-line
        }
        createGameInitialState(roomID, numPlayer);
        socket.emit(ACTIONS.CREATED_ROOM, {
            roomID,
            playerID,
        });
    });

    socket.on(ACTIONS.JOIN_ROOM, ({ roomID, playerID }) => {
        console.log("JOIN room", roomID, "player", playerID);
        if (!gameState.has(roomID)) {
            socket.emit("RESET");
            return;
        }

        socket.roomID = roomID; // eslint-disable-line
        socket.join(roomID);
        assignPlayer(socket, playerID);
        sendState(socket);
    });

    socket.on(ACTIONS.TRAY_MOVE, (msg) => {
        console.log(ACTIONS.TRAY_MOVE, socket.roomID);
        const state = gameState.get(socket.roomID);
        state.playersHand[msg.playerID] = msg.playerHand;
    });

    socket.on(ACTIONS.DRAW, () => {
        console.log("Draw");
        draw(socket);
    });
});

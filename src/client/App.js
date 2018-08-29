import React from "react";
import TileModel from "../models/TileModel";
import * as ACTIONS from "../server/actions";
import TableOfTiles from "./TableOfTiles";

function processGameState(gameState) {
    return {
        playerHand: createModels(gameState.playerHand),
        board: createModels(gameState.board),
    };
}

function createModels(data) {
    const matrix = [];
    data.forEach((row, rowIdx) => {
        matrix[rowIdx] = [];
        row.forEach((cell, cellIdx) => {
            matrix[rowIdx][cellIdx] =
                cell === null
                    ? null
                    : new TileModel(cell.group, cell.color, cell.value);
        });
    });
    return matrix;
}

export default class App extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleBoardClick = this.handleBoardClick.bind(this);
        this.handleTrayClick = this.handleTrayClick.bind(this);
        this.state = {
            playerHand: [],
            board: [],
            moving: null,
        };
    }
    componentDidMount() {
        const socket = io("localhost:3000");

        socket.on("connect", function() {
            // Connected , let's sign-up for to receive messages for this room
            if (location.hash.length === 0) {
                console.log("need to create a room");
                const numPlayer = 2; //prompt("How many player?");
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
            console.log("GAME_STATE", msg);
            this.setState(processGameState(msg));
        });

        window.socket = socket;
    }

    handleClick(dataSet, ev) {
        const target = ev.currentTarget;
        const currentRow = target.parentElement.rowIndex;
        const currentCell = target.cellIndex;
        if (this.state.moving === null) {
            // target.classList.add("moving");
            this.setState({
                moving: {
                    row: currentRow,
                    cell: currentCell,
                    source: dataSet,
                },
            });
            return;
        }
        // ev.currentTarget.classList.remove("moving");
        const dataOrigin = this.state[this.state.moving.source];
        const originRow = this.state.moving.row;
        const originCell = this.state.moving.cell;
        const data = dataOrigin[originRow][originCell];
        const dataDest = this.state[dataSet];
        const dd = dataDest[currentRow][currentCell];
        dataDest[currentRow][currentCell] = data;
        dataOrigin[originRow][originCell] = dd;

        this.setState({
            moving: null,
            [dataSet]: dataDest,
            [this.state.moving.source]: dataOrigin,
        });
    }

    handleBoardClick(ev) {
        this.handleClick("board", ev);
    }

    handleTrayClick(ev) {
        const wasTrayMove =
            this.state.moving !== null &&
            this.state.moving.source === "playerHand";
        this.handleClick("playerHand", ev);
        if (wasTrayMove) {
            socket.emit(ACTIONS.TRAY_MOVE, {
                roomID: location.hash.substr(1, location.hash.length),
                playerID: 0,
                playerHand: this.state.playerHand,
            });
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <TableOfTiles
                    cls="board"
                    tiles={this.state.board}
                    onClick={this.handleBoardClick}
                />
                <TableOfTiles
                    cls="player-tray"
                    tiles={this.state.playerHand}
                    onClick={this.handleTrayClick}
                />
            </div>
        );
    }
}

/* global io window socket */
import React from "react";
import { List } from "immutable";
import TileModel from "../models/TileModel";
import * as ACTIONS from "../server/actions";
import TableOfTiles from "./TableOfTiles";

const BOARD = "board";
const PLAYER_TRAY = "playerTray";

function createModels(data) {
    let matrix = List();
    data.forEach((row, rowIdx) => {
        let rowList = List();
        row.forEach((cell, cellIdx) => {
            rowList = rowList.set(
                cellIdx,
                cell === null
                    ? null
                    : new TileModel(cell.group, cell.color, cell.value)
            );
        });
        matrix = matrix.set(rowIdx, rowList);
    });
    return matrix;
}

function processGameState(gameState) {
    const board = createModels(gameState.board);
    const playerTray = createModels(gameState.playerTray);
    return {
        board,
        playerTray,
        previousValidState: {
            board,
            playerTray,
        },
    };
}

export default class App extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.handleBoardClick = this.handleBoardClick.bind(this);
        this.handleTrayClick = this.handleTrayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.state = {
            playerTray: [],
            board: [],
            moving: null,
            previousValidState: null,
        };
    }

    componentDidMount() {
        const socket = io("localhost:3000");

        socket.on("connect", () => {
            // Connected , let's sign-up for to receive messages for this room
            if (window.location.hash.length === 0) {
                console.log("need to create a room");
                // const numPlayer = prompt("How many player?");
                socket.emit(ACTIONS.CREATE_ROOM, {
                    numPlayer: 2, // parseInt(numPlayer, 10),
                });
            } else {
                console.log("join room");
                socket.emit(
                    ACTIONS.JOIN_ROOM,
                    window.location.hash.substr(1, window.location.hash.length)
                );
            }
        });
        socket.on("RESET", () => {
            window.location.href = "/";
        });
        socket.on(ACTIONS.CREATED_ROOM, (msg) => {
            window.location.hash = msg.roomID;
            console.log(msg);
        });
        socket.on(ACTIONS.GAME_STATE, (msg) => {
            console.log("GAME_STATE", msg);
            this.setState(processGameState(msg));
        });

        window.socket = socket;
    }

    log(msg) {
        if (this.state.previousValidState)
            console.log(
                msg,
                // this.state.previousValidState.board[
                // this.state.previousValidState.board.size - 1
                // ][0],
                this.state
            );
    }

    handleClick(newSource, ev) {
        this.log("Click " + newSource);
        const target = ev.currentTarget;
        this.setState((prevState) => {
            const currentRow = target.parentElement.rowIndex;
            const currentCell = target.cellIndex;
            if (prevState.moving === null) {
                // target.classList.add("moving");
                return {
                    moving: {
                        row: currentRow,
                        cell: currentCell,
                        source: newSource,
                    },
                };
            }
            const dataPatch = { moving: null };
            const originSource = prevState.moving.source;
            // ev.currentTarget.classList.remove("moving");

            let dataOrigin = prevState[prevState.moving.source];
            const originRow = prevState.moving.row;
            const originCell = prevState.moving.cell;
            const newData = dataOrigin.get(originRow).get(originCell);
            let dataDest = prevState[newSource];

            // Get the value in the cell we are moving into
            const oldData = dataDest.get(currentRow).get(currentCell);

            // Set the new value
            dataDest = dataDest.setIn([currentRow, currentCell], newData);

            // Now we need to put back the old value into the origin: swap
            if (newSource === originSource) {
                dataDest = dataDest.setIn([originRow, originCell], oldData);
                dataPatch[newSource] = dataDest;
            }
            dataPatch[newSource] = dataDest;
            if (newSource !== originSource) {
                dataOrigin = dataOrigin.setIn([originRow, originCell], oldData);
                dataPatch[originSource] = dataOrigin;
            }

            return dataPatch;

            // return {
            //     // moving: null,
            //     [newSource]: dataDest,
            //     [originSource]: dataOrigin,
            // };
        });
    }

    handleBoardClick(ev) {
        this.handleClick(BOARD, ev);
        this.log("post click");
    }

    handleTrayClick(ev) {
        // const { moving } = this.state;
        // const wasTrayMove = moving !== null && moving.source === "playerTray";
        this.handleClick(PLAYER_TRAY, ev);
        // if (wasTrayMove) {
        //     this.saveTrayState();
        // }
    }

    // saveTrayState() {
    //     const { playerTray } = this.state;
    //     window.socket.emit(ACTIONS.TRAY_MOVE, {
    //         roomID: window.location.hash.substr(1, window.location.hash.length),
    //         playerID: 0,
    //         playerTray,
    //     });
    // }

    handleResetClick() {
        this.log("Click Reset");
        const { previousValidState } = Object.assign({}, this.state);
        this.setState({
            // return {
            moving: null,
            board: previousValidState.board,
            playerTray: previousValidState.playerTray,
            // };
        });
    }

    render() {
        this.log("Render");

        // if (this.state.board.length)
        //     console.log(
        //         "equal",

        //         this.state.board == this.state.previousValidState.board
        //     );
        const { board, playerTray } = this.state;
        return (
            <div>
                <TableOfTiles
                    cls="board"
                    tiles={board}
                    onClick={this.handleBoardClick}
                />
                <button type="button">Play</button>
                <button type="button" onClick={this.handleResetClick}>
                    Rest Moves
                </button>
                <TableOfTiles
                    cls="player-tray"
                    tiles={playerTray}
                    onClick={this.handleTrayClick}
                />
            </div>
        );
    }
}

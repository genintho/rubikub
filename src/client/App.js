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
        // this.handlePlayClick = this.handlePlayClick.bind(this);
        this.handleDrawClick = this.handleDrawClick.bind(this);
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
                    playerID: window.localStorage.getItem("playerID"),
                });
            } else {
                console.log("join room");
                const roomID = window.location.hash.substr(
                    1,
                    window.location.hash.length
                );
                socket.emit(ACTIONS.JOIN_ROOM, {
                    roomID,
                    playerID: window.localStorage.getItem("playerID"),
                });
            }
        });

        socket.on("RESET", () => {
            window.location.href = "/";
        });

        socket.on(ACTIONS.CREATED_ROOM, ({ roomID, playerID }) => {
            window.location.hash = roomID;
            window.localStorage.setItem("playerID", playerID);
            window.setTimeout(() => {
                window.location.reload();
            }, 200);
        });

        socket.on(ACTIONS.GAME_STATE, (msg) => {
            console.log("GAME_STATE", msg);
            window.localStorage.setItem("playerID", msg.playerID);
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

    // handlePlayClick() {
    // User click play, let's check the state of the game
    // 1. Make sure all board pieces are still there
    // 2. Build all the groups of pieces we can find
    // 3. Make sure all the groups are valid
    // }

    handleDrawClick() {
        this.bob = 3;
        socket.emit(ACTIONS.DRAW, {});
    }

    // saveTrayState() {
    //     const { playerTray } = this.state;
    //     window.socket.emit(ACTIONS.TRAY_MOVE, {
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
        const isPlayerTurn = true;
        const boardClick = isPlayerTurn ? this.handleBoardClick : () => {};
        return (
            <div>
                <TableOfTiles cls="board" tiles={board} onClick={boardClick} />
                {isPlayerTurn && (
                    <div>
                        <button type="button">Play</button>
                        <button type="button" onClick={this.handleDrawClick}>
                            Draw
                        </button>
                        <button type="button" onClick={this.handleResetClick}>
                            Rest Moves
                        </button>
                    </div>
                )}
                <TableOfTiles
                    cls="player-tray"
                    tiles={playerTray}
                    onClick={this.handleTrayClick}
                />
            </div>
        );
    }
}

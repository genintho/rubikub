/* global io window socket */
import React from "react";
import { TileModel } from "./models/TileModel";
import * as ACTIONS from "./server/actions";
import TableOfTiles from "./TableOfTiles";
import { isValidMove } from "./lib/isValidMove";
import { ISocket } from "./types/ISocket";
import {
    IBoard,
    IPlayerGameState,
    ITileJSON,
    IGroupTile,
    IPlayerTray,
    IPlayers,
    TileRow,
} from "./types/Game";

declare var socket: ISocket;

enum ClickSrc {
    Board = "board",
    PlayerTray = "playerTray",
}

function createModels(data: any): IGroupTile {
    let matrix: IGroupTile = [];
    data.forEach((row: ITileJSON[], rowIdx: number) => {
        let rowList: TileRow = [];
        row.forEach((cell: ITileJSON, cellIdx: number) => {
            rowList[cellIdx] =
                cell === null
                    ? null
                    : new TileModel(cell.set, cell.color, cell.value);
        });
        matrix[rowIdx] = rowList;
    });
    return matrix;
}

function processGameState(gameState: IPlayerGameState): IState {
    const board = createModels(gameState.board);
    const playerTray = createModels(gameState.playerTray);
    return {
        board,
        moving: null,
        playerTray,
        players: gameState.players,
        turn: gameState.turn,
        previousValidState: {
            board,
            playerTray,
        },
    };
}

interface IProps {}

interface IState {
    board: IBoard | null;
    playerTray: IPlayerTray | null;
    players: IPlayers;
    turn: number;
    moving: null | {
        row: number;
        cell: number;
        source: ClickSrc;
    };
    previousValidState: {
        board: IBoard;
        playerTray: IPlayerTray;
    } | null;
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleBoardClick = this.handleBoardClick.bind(this);
        this.handleTrayClick = this.handleTrayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.handlePlayClick = this.handlePlayClick.bind(this);
        this.handleDrawClick = this.handleDrawClick.bind(this);
        this.state = {
            playerTray: null,
            board: null,
            turn: 0,
            players: [],
            moving: null,
            previousValidState: null,
        };
    }

    componentDidMount() {
        // @ts-ignore
        const socket = io("localhost:3001") as ISocket;

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

        socket.on(ACTIONS.GAME_RESET, () => {
            window.location.href = "/";
        });

        socket.on(ACTIONS.CREATED_ROOM, ({ roomID, playerID }) => {
            window.location.hash = roomID;
            window.localStorage.setItem("playerID", playerID);
            window.setTimeout(() => {
                window.location.reload();
            }, 200);
        });

        socket.on(ACTIONS.GAME_STATE, (msg: IPlayerGameState) => {
            console.log("GAME_STATE", msg);
            window.localStorage.setItem("playerID", msg.playerID);
            this.setState(processGameState(msg));
        });

        socket.on(ACTIONS.RELOAD, () => {
            window.location.reload();
        });

        // @ts-ignore
        window.socket = socket as ISocket;
    }

    log(msg: any) {
        if (this.state.previousValidState)
            console.log(
                msg,
                // this.state.previousValidState.board[
                // this.state.previousValidState.board.size - 1
                // ][0],
                this.state
            );
    }

    handleClick(
        newSource: ClickSrc,
        ev: React.MouseEvent<HTMLTableCellElement>
    ) {
        console.log("handleClick", ev);
        const target = ev.currentTarget;
        console.log("handleClick target", target);
        if (null === target || target.parentElement === null) {
            return;
        }
        const parent = target.parentElement as HTMLTableRowElement;
        console.log("handleClick parent", parent);
        // if (!parent) {
        //     return;
        // }
        const rowIdx = parent.rowIndex;
        const cellIdx = target.cellIndex;

        // @ts-ignore
        this.setState((prevState: IState) => {
            if (prevState.moving === null) {
                // target.classList.add("moving");
                return {
                    moving: {
                        row: rowIdx,
                        cell: cellIdx,
                        source: newSource,
                    },
                };
            }
            const dataPatch = { moving: null };
            const originSource = prevState.moving.source;
            // ev.currentTarget.classList.remove("moving");

            let dataOrigin = prevState[prevState.moving.source];
            if (dataOrigin === null) {
                return;
            }

            const originRow = prevState.moving.row;
            const originCell = prevState.moving.cell;
            if (!dataOrigin[originRow]) {
                return;
            }
            let tmp = dataOrigin[originRow];
            if (undefined === tmp) {
                return;
            }
            const newData = tmp[originCell];
            let dataDest = prevState[newSource];
            if (dataDest === null) {
                return;
            }
            // Get the value in the cell we are moving into
            tmp = dataDest[rowIdx];
            if (undefined === tmp) {
                return;
            }
            const oldData = tmp[cellIdx];

            // Set the new value
            dataDest[rowIdx][cellIdx] = newData;

            // Now we need to put back the old value into the origin: swap
            if (newSource === originSource) {
                dataDest[originRow][originCell] = oldData;
                // @ts-ignore
                dataPatch[newSource] = dataDest;
            }
            // @ts-ignore
            dataPatch[newSource] = dataDest;
            if (newSource !== originSource) {
                dataOrigin[originRow][originCell] = oldData;
                // @ts-ignore
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

    handleBoardClick(ev: React.MouseEvent<HTMLTableCellElement>) {
        this.handleClick(ClickSrc.Board, ev);
        this.log("post click");
    }

    handleTrayClick(ev: React.MouseEvent<HTMLTableCellElement>) {
        // const { moving } = this.state;
        // const wasTrayMove = moving !== null && moving.source === "playerTray";
        this.handleClick(ClickSrc.PlayerTray, ev);
        // if (wasTrayMove) {
        //     this.saveTrayState();
        // }
    }

    handlePlayClick() {
        const { board, playerTray, previousValidState } = this.state;
        if (
            board === null ||
            playerTray === null ||
            previousValidState === null
        ) {
            return;
        }
        // User click play, let's check the state of the game
        // 1. Make sure all board pieces are still there
        // 2. Build all the groups of pieces we can find
        // 3. Make sure all the groups are valid
        console.log(board);
        if (!isValidMove(board, previousValidState.board)) {
            window.alert("INVALID MOVE"); // eslint-disable-line no-alert
            return;
        }
        socket.emit(ACTIONS.PLAY, {
            board: board,
            playerTray: playerTray,
        });
    }

    handleDrawClick() {
        // this.bob = 3;
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
        if (previousValidState === null) {
            return;
        }
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
        const { board, playerTray, players, turn } = this.state;
        const isPlayerTurn =
            players[turn % players.length] ===
            window.localStorage.getItem("playerID");
        const boardClick = isPlayerTurn ? this.handleBoardClick : () => {};
        return (
            <div>
                <h1>Turn {turn}</h1>
                <div className="players-list">
                    <p>Players:</p>
                    <ul>
                        {players.map((playerName: string) => (
                            <li key={playerName}>{playerName}</li>
                        ))}
                    </ul>
                </div>
                <TableOfTiles cls="board" tiles={board} onClick={boardClick} />
                {isPlayerTurn && (
                    <div>
                        <button type="button" onClick={this.handlePlayClick}>
                            Play
                        </button>
                        <button type="button" onClick={this.handleDrawClick}>
                            Draw
                        </button>
                        <button type="button" onClick={this.handleResetClick}>
                            Reset Moves
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

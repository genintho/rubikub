/* global io window socket */
import React from "react";
import classnames from "classnames";
import { createModels } from "./lib/createModels";
import * as ACTIONS from "./server/actions";
import TableOfTiles from "./TableOfTiles";
import { ISocket } from "./types/ISocket";
import {
    EClickSrc,
    IBoard,
    IPlayerGameState,
    IPlayerTray,
    IPlayers,
    IuiMove,
} from "./types/Game";

declare var socket: ISocket;

interface IProps {}

interface IState {
    board: IBoard | null;
    playerTray: IPlayerTray | null;
    players: IPlayers;
    turn: number;
    playerTurn: string;
    moving: null | IuiMove;
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
            playerTurn: "",
            players: [],
            moving: null,
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

        socket.on(ACTIONS.NEW_GAME_STATE, (msg: IPlayerGameState) => {
            console.log("ACTIONS.GAME_STATE", msg);
            // window.localStorage.setItem("playerID", msg.playerID);
            const board = createModels(msg.board);
            const newState: any = {
                board,
                moving: null,
                players: msg.players,
                turn: msg.turn,
                playerTurn: msg.playerTurn,
            };
            this.setState(newState);
        });

        socket.on(ACTIONS.PLAYER_TRAY, (a) => {
            console.log("ACTION.PLAYER_TRAY", a);
            this.setState({ playerTray: createModels(a.playerTray) });
        });

        socket.on(ACTIONS.ERROR_MOVE, (msg) => {
            alert(msg);
        });

        // @ts-ignore
        window.socket = socket as ISocket;
    }

    log(msg: any) {
        console.log(msg, this.state);
    }

    handleClick(
        newSource: EClickSrc,
        ev: React.MouseEvent<HTMLTableCellElement>
    ) {
        const target = ev.currentTarget;
        if (null === target || target.parentElement === null) {
            return;
        }
        const parent = target.parentElement as HTMLTableRowElement;
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

            // @ts-ignore
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
        this.handleClick(EClickSrc.Board, ev);
    }

    handleTrayClick(ev: React.MouseEvent<HTMLTableCellElement>) {
        const { moving } = this.state;
        const wasTrayMove = moving !== null && moving.source === "playerTray";
        this.handleClick(EClickSrc.PlayerTray, ev);
        if (wasTrayMove) {
            const { playerTray } = this.state;
            // Hack to deal with React Async setState call
            setImmediate(() => {
                socket.emit(ACTIONS.TRAY_MOVE, {
                    playerTray,
                });
            });
        }
    }

    handlePlayClick() {
        const { board, playerTray } = this.state;
        if (board === null || playerTray === null) {
            return;
        }
        socket.emit(ACTIONS.PLAY, {
            board: board,
            playerTray: playerTray,
        });
    }

    handleDrawClick() {
        socket.emit(ACTIONS.DRAW, {});
    }

    handleResetClick() {
        this.log("Click Reset");
        // const { previousValidState } = Object.assign({}, this.state);
        // if (previousValidState === null) {
        //     return;
        // }
        // this.setState({
        //     // return {
        //     moving: null,
        //     board: previousValidState.board,
        //     playerTray: previousValidState.playerTray,
        //     // };
        // });
    }

    render() {
        this.log("Render");
        const {
            board,
            playerTray,
            players,
            turn,
            playerTurn,
            moving,
        } = this.state;
        const isPlayerTurn =
            playerTurn === window.localStorage.getItem("playerID");
        const boardClick = isPlayerTurn ? this.handleBoardClick : () => {};
        return (
            <div>
                <h1>Turn {turn}</h1>
                <div className="players-list">
                    <p>Players:</p>
                    <ul>
                        {players.map((playerName: string) => (
                            <li
                                key={playerName}
                                className={classnames({
                                    playerTurn: playerTurn === playerName,
                                })}
                            >
                                {playerName}
                            </li>
                        ))}
                    </ul>
                </div>
                <TableOfTiles
                    cls="board"
                    tiles={board}
                    onClick={boardClick}
                    movingCell={
                        moving && moving.source === EClickSrc.Board
                            ? moving.cell
                            : -1
                    }
                    movingRow={
                        moving && moving.source === EClickSrc.Board
                            ? moving.row
                            : -1
                    }
                />
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
                    movingCell={
                        moving && moving.source === EClickSrc.PlayerTray
                            ? moving.cell
                            : -1
                    }
                    movingRow={
                        moving && moving.source === EClickSrc.PlayerTray
                            ? moving.row
                            : -1
                    }
                />
            </div>
        );
    }
}

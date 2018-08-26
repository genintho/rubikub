import React from "react";
import TileModel from "../models/TileModel";
// import TileGroupModel from "../models/TileGroupModel";
import * as ACTIONS from "../server/actions";
// import Board from "./Board";
import TableBoard from "./TableBoard";

function processGameState(gameState) {
    const playerHand = gameState.playerHand.map((item) => {
        return new TileModel(item.group, item.color, item.value);
    });
    const tableState = [];
    gameState.table.forEach((row, rowIdx) => {
        tableState[rowIdx] = [];
        row.forEach((cell, cellIdx) => {
            tableState[rowIdx][cellIdx] = cell === null ? null : new TileModel(cell.group, cell.color, cell.value);
        });
    });

    return { playerHand, table: tableState };
}

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            playerHand: [],
            table: [],
        };
    }
    componentDidMount() {
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
            console.log("GAME_STATE",msg);
            this.setState(processGameState(msg));
        });
    }
    render() {
        //<Board tableState={tableState}/>
        return (<div>
            <TableBoard board={this.state.table}/>

        </div>);
    }
}

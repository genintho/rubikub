import React from "react";
import Tile from "./Tile";
import TileModel from "../models/Tile";
import * as ACTIONS from "../server/actions";

// const r = document.getElementById("player-board");
// // console.log(r);
// allTiles.forEach(tile => {
//   //   // <div draggable="true" ondragstart="drag(event)">Bss</div>
//   const tileEl = buildTileElement(tile);
//   console.log(tileEl.id);
//   r.appendChild(tileEl);
// });

// function buildTileElement(tile) {
//   const el = document.createElement("div");
//   el.classList.add("tile");
//   el.style.color = tile.color;
//   el.draggable = true;
//   el.appendChild(document.createTextNode(tile.value));
//   return el;
// }

function processGameState(gameState) {
    const playerHand = gameState.playerHand.map((item) => {
        return new TileModel(item.group, item.color, item.value);
    });

    return { playerHand, table: gameState.table };
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
            console.log(msg);
            this.setState(processGameState(msg));
        });
    }
    render() {
        return (
            <div>
                <div className="flex-container">
                    <div className="row">
                        <table>
                            <tbody>
                                <tr>
                                    <td colSpan="3" />
                                </tr>
                                <tr>
                                    <td />
                                    <td draggable="true">A</td>
                                    <td />
                                </tr>
                                <tr>
                                    <td colSpan="3" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="player-board">
                    {this.state.playerHand.map((tile) => {
                        return <Tile key={tile.id} data={tile} />;
                    })}
                </div>
            </div>
        );
    }
}

import React from "react";
import Tile from "./Tile";
import { IGroupTile } from "./types/Game";

interface iProps {
    readonly cls: string;
    tiles: IGroupTile | null;
    onClick: (ev: React.MouseEvent<HTMLTableCellElement>) => void;
}

export default class TableOfTiles extends React.Component<iProps> {
    // constructor() {
    //     super();
    // this.state = {
    //     moving: false
    // };
    // this.handleClick = this.handleClick.bind(this);
    // }
    //
    // handleClick(ev) {
    //     const target = ev.currentTarget;
    //     if( this.state.moving === false ) {
    //         target.classList.add("moving");
    //         this.setState({moving: {
    //             row: target.parentElement.rowIndex,
    //             cell: target.cellIndex
    //             }});
    //         return;
    //     }
    //     const source = target.parentElement.parentElement.rows[this.state.moving.row].cells[this.state.moving.cell];
    //     target.innerHTML = source.innerHTML;
    //     source.innerHTML = "";
    //     source.classList.remove("moving");
    //     this.setState({moving: false})
    // }

    render() {
        if (this.props.tiles === null) {
            return <h1>a</h1>;
        }
        return (
            <div className={this.props.cls}>
                <table>
                    <tbody>
                        {this.props.tiles.map((row, rowIdx) => {
                            return (
                                <tr key={"row-" + rowIdx}>
                                    {row.map((cell, cellIdx) => {
                                        return (
                                            <td
                                                key={
                                                    "cell-" +
                                                    rowIdx +
                                                    "-" +
                                                    cellIdx
                                                }
                                                className="cell"
                                                onClick={this.props.onClick}
                                            >
                                                {cell !== null && (
                                                    <Tile data={cell} />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

import React from "react";
import Tile from "./Tile";


export default class Board extends React.Component {
    render() {
        const tableState = this.props.tableState;
        let numRow = tableState.length;
        let numCol = 0;
        console.log("tableState", tableState);
        tableState.forEach((groupsInRow, row) => {
            let rowWidth = 0;

            groupsInRow.forEach((group, groupNum ) => {
                rowWidth += group.size * 2 + 1; // insert
            });
            rowWidth += groupsInRow.length + 1; // divider cell
            numCol = Math.max(numCol, rowWidth);
        });
        console.log("Width", numCol);
        return (<div>
            <h1>Board</h1>
            <div className="flex-container">
                <div className="row">
                    <table>
                        {this.state.table.length === 0 && (
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
                        )}
                        {this.state.table.length !== 0 && (
                            <tbody>
                            <EmptyRow numCol={numCol} />
                            {tableState.map((row, i) => {
                                return <Row key={i} rowGroups={row} />;
                            })}
                            <EmptyRow numCol={numCol} />
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>);
    }
}



function Row({ rowGroups }) {
    return (
        <tr className="row">
            {rowGroups.map((group, idx) => {
                console.log(group);
                return <TileGroup key={idx} group={group} />;
            })}
            <DividerCell />
        </tr>
    );
}

function TileGroup({ group }) {
    return (
        <React.Fragment>
            <DividerCell />
            {group._tiles.map((tile, idx) => {
                return (
                    <React.Fragment key={idx}>
                        <InsertCell />
                        <td>
                            <Tile data={tile} />
                        </td>
                    </React.Fragment>
                );
            })}
            <InsertCell />
        </React.Fragment>
    );
}

function EmptyRow({ numCol }) {
    const divs = [];
    for (let i = 0; i < numCol; i++) {
        divs.push(<DividerCell key={i} />);
    }
    return <tr>{divs}</tr>;
}

function DividerCell() {
    return <td className="divider" />;
}

function InsertCell() {
    return <td className="insert" />;
}

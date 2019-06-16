import React from "react";

export default class TileGroup extends React.Component {
    render() {
        const { data } = this.props;
        if (data.isJoker) {
            return <div>JOKER</div>;
        }
        return (
            <div
                draggable={true}
                className="tile"
                style={{ color: data.color, border: "solid 1px " + data.color }}
            >
                {data.value}
            </div>
        );
    }
}

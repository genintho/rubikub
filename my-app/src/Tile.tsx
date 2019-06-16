import React from "react";
// import Styles from "./Tile.css";

export default class Tile extends React.Component<{ data: any }> {
    render() {
        const { data } = this.props;
        if (data.isJoker) {
            return <div>JOKER</div>;
        }
        return (
            <div
                draggable={true}
                // className={Styles.tile}
                style={{ color: data.color, border: "solid 1px " + data.color }}
                onDragStart={(ev) => {
                    // window.drag(ev);
                }}
            >
                {data.value}
            </div>
        );
    }
}

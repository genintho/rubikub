export enum TileColors {
    RED = "red",
    YELLOW = "orange",
    BLUE = "#2196f3",
    GREEN = "green",
}

export class TileModel {
    constructor(
        public set: number,
        public color: string,
        public value: string
    ) {}

    get isJoker() {
        return this.value === "JOKER";
    }

    get id() {
        return this.set + "_" + this.color + "_" + this.value; // eslint-disable-line
    }
}

// Tile.COLORS = {
//     RED: "red",
//     YELLOW: "orange",
//     BLUE: "#2196f3",
//     GREEN: "green",
// };

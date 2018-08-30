class Tile {
    constructor(set, color, value) {
        this.set = set;
        this.color = color;
        this.value = value;
    }

    get isJoker() {
        return this.value === "JOKER";
    }

    get id() {
        return this.set + "_" + this.color + "_" + this.value; // eslint-disable-line
    }
}

Tile.COLORS = {
    RED: "red",
    YELLOW: "orange",
    BLUE: "#2196f3",
    GREEN: "green",
};

module.exports = Tile;

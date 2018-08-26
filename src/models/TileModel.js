class Tile {
    constructor(group, color, value) {
        this.group = group;
        this.color = color;
        this.value = value;
        this.has;
    }

    get isJoker() {
        return this.value === "JOKER";
    }

    get id() {
        return this.group + "_" + this.color + "_" + this.value;
    }
}

Tile.COLORS = {
    RED: "red",
    YELLOW: "orange",
    BLUE: "#2196f3",
    GREEN: "green",
};

module.exports = Tile;

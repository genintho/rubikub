export var TileColors;
(function (TileColors) {
    TileColors["RED"] = "red";
    TileColors["YELLOW"] = "orange";
    TileColors["BLUE"] = "#2196f3";
    TileColors["GREEN"] = "green";
})(TileColors || (TileColors = {}));
var TileModel = /** @class */ (function () {
    function TileModel(set, color, value) {
        this.set = set;
        this.color = color;
        this.value = value;
    }
    Object.defineProperty(TileModel.prototype, "isJoker", {
        get: function () {
            return this.value === "JOKER";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileModel.prototype, "id", {
        get: function () {
            return this.set + "_" + this.color + "_" + this.value; // eslint-disable-line
        },
        enumerable: true,
        configurable: true
    });
    return TileModel;
}());
export { TileModel };
// Tile.COLORS = {
//     RED: "red",
//     YELLOW: "orange",
//     BLUE: "#2196f3",
//     GREEN: "green",
// };

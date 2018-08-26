module.exports = class TileGroupModel {
    constructor() {
        this._tiles = [];
    }

    add(tile) {
        this._tiles.push(tile);
    }

    get size() {
        return this._tiles.length;
    }

    get length() {
        return this.size;
    }
};

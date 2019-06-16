import { TileModel } from "./TileModel";

export class TileGroupModel {
    private _tiles: TileModel[];
    constructor() {
        this._tiles = [];
    }

    add(tile: TileModel) {
        this._tiles.push(tile);
    }

    get size() {
        return this._tiles.length;
    }

    get length() {
        return this.size;
    }

    isValid() {
        if (this.size < 3) {
            return false;
        }

        return this._tiles[0].value === this._tiles[1].value
            ? this.isValidSameValue()
            : this.isValidSerie();
    }

    isValidSerie() {
        if (this.size > 13) {
            return false;
        }
        let valid = true;
        for (let idx = 1; idx < this.size; idx += 1) {
            const prevTile = this._tiles[idx - 1];
            const curTile = this._tiles[idx];

            if (prevTile.color !== curTile.color) {
                valid = false;
            }
            if (Number(prevTile.value) + 1 !== Number(curTile.value)) {
                valid = false;
            }
        }
        return valid;
    }

    isValidSameValue() {
        if (this.size > 4) {
            return false;
        }
        let valid = true;
        const seenColors = new Set();
        const refValue = this._tiles[0].value;
        this._tiles.forEach((tile) => {
            if (tile.value !== refValue) {
                valid = false;
            }
            if (seenColors.has(tile.color)) {
                valid = false;
            }
            seenColors.add(tile.color);
        });
        return valid;
    }
}

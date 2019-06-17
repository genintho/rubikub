import { IGroupTile, ITileJSON, TileRow } from "../types/Game";
import { TileModel } from "../models/TileModel";

export function createModels(data: any): IGroupTile {
    let matrix: IGroupTile = [];
    data.forEach((row: ITileJSON[], rowIdx: number) => {
        let rowList: TileRow = [];
        row.forEach((cell: ITileJSON, cellIdx: number) => {
            rowList[cellIdx] =
                cell === null
                    ? null
                    : new TileModel(cell.set, cell.color, cell.value);
        });
        matrix[rowIdx] = rowList;
    });
    return matrix;
}

import { TileGroupModel } from "../models/TileGroupModel";
import { IBoard } from "../types/Game";

export function buildTileGroups(board: IBoard): TileGroupModel[] {
    const groups: TileGroupModel[] = [];
    board.forEach((row) => {
        let previsCell = false;
        let curGroup: TileGroupModel | null = null;
        row.forEach((cell) => {
            if (cell !== null) {
                // We are seeing a new group
                if (!previsCell) {
                    curGroup = new TileGroupModel();
                    groups.push(curGroup);
                }
                previsCell = true;
                if (curGroup) {
                    curGroup.add(cell);
                }
            }
            if (cell === null) {
                if (previsCell) {
                    curGroup = null;
                }
                previsCell = false;
            }
        });
    });
    return groups;
}

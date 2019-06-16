import { fromJS, List } from "immutable";
import {hasAllBoardPieces} from "../hasAllBoardPieces";
import {Tile as TileModel} from"../../../models/TileModel";

describe("hasAllBoardPieces", () => {
    it("should handle empty", () => {
        const res = hasAllBoardPieces(List(), List());
        expect(res).toBeTruthy();
    });
    it("should return true when all are seen", () => {
        const res = hasAllBoardPieces(
            fromJS([[new TileModel(1, "red", 1)]]),
            List()
        );
        expect(res).toBeTruthy();
    });
    it("should be happy identical", () => {
        const res = hasAllBoardPieces(
            fromJS([[null, new TileModel(1, "red", 1)]]),
            fromJS([[new TileModel(1, "red", 1), null]])
        );
        expect(res).toBeTruthy();
    });
    it("should return false when some are missing", () => {
        const res = hasAllBoardPieces(
            fromJS([[new TileModel(1, "red", 1)]]),
            fromJS([[new TileModel(0, "red", 1)]])
        );
        expect(res).toBeFalsy();
    });
});

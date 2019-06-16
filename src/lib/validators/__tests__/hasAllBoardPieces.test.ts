import { hasAllBoardPieces } from "../hasAllBoardPieces";
import { TileModel } from "../../../models/TileModel";

describe("hasAllBoardPieces", () => {
    it("should handle empty", () => {
        const res = hasAllBoardPieces([], []);
        expect(res).toBeTruthy();
    });
    it("should return true when all are seen", () => {
        const res = hasAllBoardPieces([[new TileModel(1, "red", "1")]], []);
        expect(res).toBeTruthy();
    });
    it("should be happy identical", () => {
        const res = hasAllBoardPieces(
            [[null, new TileModel(1, "red", "1")]],
            [[new TileModel(1, "red", "1"), null]]
        );
        expect(res).toBeTruthy();
    });
    it("should return false when some are missing", () => {
        const res = hasAllBoardPieces(
            [[new TileModel(1, "red", "1")]],
            [[new TileModel(0, "red", "1")]]
        );
        expect(res).toBeFalsy();
    });
});

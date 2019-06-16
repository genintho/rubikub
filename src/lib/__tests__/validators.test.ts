import { hasAllBoardPieces, hasMoved } from "../validators";
import { TileModel } from "../../models/TileModel";

describe("validators", () => {
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

    describe("hasMoved", () => {
        test("empty board", () => {
            const res = hasMoved([], []);
            expect(res).toBeFalsy();
        });
        test("same pieces board", () => {
            const res = hasMoved(
                [[new TileModel(0, "red", "1")]],
                [[new TileModel(0, "red", "1")]]
            );
            expect(res).toBeFalsy();
        });
        test("a new pieces", () => {
            const res = hasMoved([[new TileModel(0, "red", "1")]], []);
            expect(res).toBeTruthy();
        });
        test("different order", () => {
            const res = hasMoved(
                [
                    [new TileModel(0, "red", "1")],
                    [new TileModel(1, "red", "1")],
                ],
                [[new TileModel(1, "red", "1")], [new TileModel(0, "red", "1")]]
            );
            expect(res).toBeFalsy();
        });
    });

    describe("isValidMove", () => {
        test("different order", () => {
            const res = hasMoved(
                [
                    [
                        new TileModel(1, "red", "1"),
                        new TileModel(1, "red", "2"),
                        new TileModel(1, "red", "3"),
                    ],
                ],
                []
            );
            expect(res).toBeTruthy();
        });
    });
});

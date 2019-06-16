import { TileModel, TileColors } from "../TileModel";
import { TileGroupModel } from "../TileGroupModel";

describe("buildTileGroups", () => {
    let group = null;
    beforeEach(() => {
        group = new TileGroupModel();
    });

    it("reject 1 tile ", () => {
        group.add(new TileModel(1, TileColors.RED, 1));
        expect(group.isValid()).toBeFalsy();
    });

    it("reject 2 tiles ", () => {
        group.add(new TileModel(1, TileColors.RED, 1));
        group.add(new TileModel(1, TileColors.BLUE, 1));
        expect(group.isValid()).toBeFalsy();
    });

    describe("series", () => {
        it("accept as valid 3 numbers serie", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.RED, 2));
            group.add(new TileModel(1, TileColors.RED, 3));
            expect(group.isValid()).toBeTruthy();
        });

        it("reject incorrect color", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.RED, 2));
            group.add(new TileModel(1, TileColors.BLUE, 3));
            expect(group.isValid()).toBeFalsy();
        });
        it("reject wrong order", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.RED, 3));
            group.add(new TileModel(1, TileColors.RED, 2));
            expect(group.isValid()).toBeFalsy();
        });
        it("reject gap", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.RED, 2));
            group.add(new TileModel(1, TileColors.RED, 4));
            expect(group.isValid()).toBeFalsy();
        });
    });
    describe("identical value", () => {
        it("reject 4+ tiles", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            expect(group.isValid()).toBeFalsy();
        });

        it("accept as valid a 3 tiles", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.YELLOW, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            expect(group.isValid()).toBeTruthy();
        });

        it("accept as valid a 4 tiles", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.YELLOW, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            group.add(new TileModel(1, TileColors.GREEN, 1));
            expect(group.isValid()).toBeTruthy();
        });

        it("reject duplicate color", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            group.add(new TileModel(1, TileColors.BLUE, 1));
            expect(group.isValid()).toBeFalsy();
        });

        it("reject different value", () => {
            group.add(new TileModel(1, TileColors.RED, 1));
            group.add(new TileModel(1, TileColors.YELLOW, 1));
            group.add(new TileModel(1, TileColors.BLUE, 2));
            group.add(new TileModel(1, TileColors.GREEN, 1));
            expect(group.isValid()).toBeFalsy();
        });
    });
});

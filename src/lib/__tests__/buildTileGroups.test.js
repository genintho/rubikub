const TileModel = require("../../models/TileModel");
const buildTileGroups = require("../buildTileGroups");

describe("buildTileGroups", () => {
    it("works with 1 tile", () => {
        const matrix = [[new TileModel(1, "r", 1)]];
        const groups = buildTileGroups(matrix);
        expect(groups).toMatchInlineSnapshot(`
Array [
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 1,
      },
    ],
  },
]
`);
    });

    it("works with 1 tile", () => {
        const matrix = [[null, null, new TileModel(1, "r", 1), null]];
        const groups = buildTileGroups(matrix);
        expect(groups).toMatchInlineSnapshot(`
Array [
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 1,
      },
    ],
  },
]
`);
    });

    it("works with a group of 2 tiles", () => {
        const matrix = [[new TileModel(1, "r", 1), new TileModel(1, "r", 2)]];
        const groups = buildTileGroups(matrix);
        expect(groups).toMatchInlineSnapshot(`
Array [
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 1,
      },
      Tile {
        "color": "r",
        "set": 1,
        "value": 2,
      },
    ],
  },
]
`);
    });
    it("works with 2 groups", () => {
        const matrix = [
            [
                null,
                new TileModel(1, "r", 1),
                null,
                null,
                new TileModel(1, "r", 2),
            ],
        ];
        const groups = buildTileGroups(matrix);
        expect(groups).toMatchInlineSnapshot(`
Array [
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 1,
      },
    ],
  },
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 2,
      },
    ],
  },
]
`);
    });

    it("works with 2 groups on different lines", () => {
        const matrix = [
            [null, null, null, new TileModel(1, "r", 2)],
            [new TileModel(1, "r", 1), null],
        ];
        const groups = buildTileGroups(matrix);
        expect(groups).toMatchInlineSnapshot(`
Array [
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 2,
      },
    ],
  },
  TileGroupModel {
    "_tiles": Array [
      Tile {
        "color": "r",
        "set": 1,
        "value": 1,
      },
    ],
  },
]
`);
    });
});

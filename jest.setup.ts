export * from "@react-native-async-storage/async-storage/jest/async-storage-mock";

require("react-native-reanimated").setUpTests();

jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-keyboard-controller", () => require("react-native-keyboard-controller/jest"));

jest.mock("@powersync/react-native", () => {
    class MockTable {
        constructor(schema) {
            this.schema = schema;
        }
    }

    class MockSchema {
        constructor(tables) {
            this.tables = tables;
        }
    }

    return {
        __esModule: true,
        column: {
            text: "text",
            integer: "integer"
        },
        Table: MockTable,
        Schema: MockSchema,
        PowerSyncDatabase: jest.fn().mockImplementation(() => ({
            subscribe: jest.fn(),
            registerTablesChangedHook: jest.fn(),
            open: jest.fn(),
            close: jest.fn()
            // amit még a tesztek igényelnek
        })),
        AbstractPowerSyncDatabase: jest.fn()
    };
});
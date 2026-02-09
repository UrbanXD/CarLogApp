import { column, Table } from "@powersync/react-native";

export const CURRENCY_TABLE = "currency" as const;

export const currencyTable = new Table({
    id: column.integer,
    key: column.text,
    symbol: column.text
});
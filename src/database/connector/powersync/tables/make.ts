import { column, Table } from "@powersync/common";

export const MAKE_TABLE = "make" as const;

export const makeTable = new Table({
    id: column.text,
    name: column.text
}, { localOnly: true });
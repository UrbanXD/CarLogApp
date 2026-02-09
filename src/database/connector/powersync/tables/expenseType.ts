import { column, Table } from "@powersync/react-native";

export const EXPENSE_TYPE_TABLE = "expense_type" as const;

export const expenseTypeTable = new Table({
    id: column.text,
    key: column.text,
    owner_id: column.text
});
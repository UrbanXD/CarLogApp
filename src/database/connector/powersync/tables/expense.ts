import { column, Table } from "@powersync/react-native";

export const EXPENSE_TABLE = "expense";

export const expenseTable = new Table({
    id: column.text,
    car_id: column.text,
    type_id: column.text,
    amount: column.real,
    currency: column.text,
    note: column.text,
    date: column.text
});
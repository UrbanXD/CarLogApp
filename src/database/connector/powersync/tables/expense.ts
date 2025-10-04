import { column, Table } from "@powersync/react-native";

export const EXPENSE_TABLE = "expense";

export const expenseTable = new Table({
    id: column.text,
    car_id: column.text,
    type_id: column.text,
    currency_id: column.integer,
    amount: column.real,
    exchange_rate: column.real,
    note: column.text,
    date: column.text
});
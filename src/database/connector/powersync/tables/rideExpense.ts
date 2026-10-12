import { column, Table } from "@powersync/common";

export const RIDE_EXPENSE_TABLE = "ride_expense" as const;

export const rideExpenseTable = new Table({
    id: column.text,
    owner_id: column.text,
    ride_log_id: column.text,
    expense_id: column.text
});
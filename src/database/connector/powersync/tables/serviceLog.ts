import { column, Table } from "@powersync/react-native";

export const SERVICE_LOG_TABLE = "service_log";

export const serviceLog = new Table({
    id: column.text,
    car_id: column.text,
    expense_id: column.text,
    odometer_log_id: column.text,
    service_type_id: column.text
});
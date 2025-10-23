import { column, Table } from "@powersync/react-native";

export const SERVICE_TYPE_TABLE = "service_type";

export const serviceTypeTable = new Table({
    id: column.text,
    key: column.text,
    owner_id: column.text
});
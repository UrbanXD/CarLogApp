import { column, Table } from "@powersync/react-native";

export const SERVICE_ITEM_TYPE_TABLE = "service_item_type" as const;

export const serviceItemTypeTable = new Table({
    id: column.text,
    key: column.text,
    owner_id: column.text
});
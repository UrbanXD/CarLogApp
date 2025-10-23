import { column, Table } from "@powersync/react-native";

export const SERVICE_ITEM_TABLE = "service_item";

export const serviceItem = new Table({
    id: column.text,
    car_id: column.text,
    service_log_id: column.text,
    service_item_type_id: column.text,
    quantity: column.integer,
    price_per_unit: column.real
});
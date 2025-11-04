import { column, Table } from "@powersync/react-native";

export const CAR_TABLE = "car";

export const carTable = new Table({
    id: column.text,
    owner_id: column.text,
    name: column.text,
    odometer_unit_id: column.text,
    currency_id: column.integer,
    model_id: column.text,
    model_year: column.text,
    image_url: column.text,
    created_at: column.text
});
import { column, Table } from "@powersync/react-native";

export const CAR_TABLE = "car";

export const carTable = new Table({
    id: column.text,
    owner_id: column.text,
    name: column.text,
    model_id: column.integer,
    model_year: column.text,
    image_url: column.text,
    created_at: column.text
});
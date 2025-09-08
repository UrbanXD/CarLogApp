import { column, Table } from "@powersync/react-native";

export const MODEL_TABLE = "model";

export const modelTable = new Table({
    id: column.text,
    make_id: column.text,
    name: column.text,
    start_year: column.text,
    end_year: column.text
});
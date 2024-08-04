import {column, Schema, TableV2} from "@powersync/react-native";

export const USERS_TABLE = "users";

const users = new TableV2({
    id: column.text,
    email: column.text,
    firstname: column.text,
    lastname: column.text
});

export const AppSchema = new Schema({
    users
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UsersType = DatabaseType["users"];
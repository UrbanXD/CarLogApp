import { column, Table } from "@powersync/react-native";

export const USER_TABLE = "user_account";

export const userTable = new Table({
    id: column.text,
    email: column.text,
    lastname: column.text,
    firstname: column.text,
    avatar_url: column.text,
    avatar_color: column.text
});
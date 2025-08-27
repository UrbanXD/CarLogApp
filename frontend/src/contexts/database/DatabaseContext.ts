import { Context, createContext, useContext } from "react";
import { Database } from "../../database/connector/Database.ts";

export const DatabaseContext = createContext(new Database());
export const useDatabase = () => useContext<Database>(DatabaseContext as Context<Database>);
import { createContext, useContext } from "react";
import { Database } from "../../database/connector/Database.ts";

export const DatabaseContext = createContext<Database | null>(null);
export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if(!context) throw new Error("useDatabase must be used within a DatabaseProvider");

    return context;
};
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";

export const loadCars = createAsyncThunk(
    "cars",
    async (database: Database, { rejectWithValue }) => {
        try {
            return await database.carDAO.getCars();
        } catch(e) {
            console.log("load cars error: ", e);
            return rejectWithValue("");
        }
    }
);
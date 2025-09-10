import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";

export const loadCars = createAsyncThunk(
    "cars",
    async (database: Database, { rejectWithValue }) => {
        try {
            return await database.carDao.getCars();
        } catch(e) {
            console.log("loadCars", e);
            return rejectWithValue("");
        }
    }
);
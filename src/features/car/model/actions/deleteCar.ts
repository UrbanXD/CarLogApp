import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";

export const deleteCar = createAsyncThunk(
    "deleteCar",
    async (args: { database: Database, carId: string }, { dispatch, rejectWithValue }) => {
        try {
            const { database: { carDao }, carId } = args;

            return await carDao.delete(carId);
        } catch(e) {
            console.log("Error at car deleteing: ", e);
            return rejectWithValue("");
        }
    }
);